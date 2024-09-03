from config import Config
from langchain.prompts import PromptTemplate
from langchain_core.runnables import RunnableSequence
from typing import List, Union, Generator
from utils import get_db_connection
import requests
from pydantic import BaseModel
from langchain.prompts.base import StringPromptValue  # 导入 StringPromptValue

class OllamaLLM(BaseModel):
    host: str
    model: str

    def call(self, prompt: str, stream: bool = False) -> Union[dict, Generator[dict, None, None]]:
        try:
            response = self._send_request(prompt, stream)
            if stream:
                return self._stream_response(response)
            return self._process_response(response)
        except requests.RequestException as e:
            print(f"Request error: {e}")
            return self._error_response("无法连接到LLM服务，请稍后重试。")
        except Exception as e:
            print(f"Error: {e}")
            return self._error_response("处理请求时发生错误，请稍后重试。")

    def _send_request(self, prompt: str, stream: bool) -> requests.Response:
        response = requests.post(
            url=f"{self.host}/v1/chat/completions",
            json={
                "model": self.model,
                "messages": [{"role": "user", "content": prompt}],
                "stream": stream,
            },
            stream=stream
        )
        response.raise_for_status()
        return response

    def _process_response(self, response: requests.Response) -> dict:
        result = response.json()
        print("LLM response:", result)  # 打印完整的响应数据

        if "choices" in result:
            content = result["choices"][0].get("message", {}).get("content", "Unexpected response structure")
        elif "response" in result:
            content = result["response"]
        else:
            content = "Unexpected response structure"

        return {"choices": [{"message": {"content": content}}]}

    def _stream_response(self, response: requests.Response) -> Generator[dict, None, None]:
        for line in response.iter_lines():
            if line:
                content = line.decode("utf-8")
                yield {"choices": [{"message": {"content": content}}]}

    def _error_response(self, message: str) -> dict:
        return {"choices": [{"message": {"content": message}}]}

# 实例化 PromptTemplate 和 OllamaLLM
prompt = PromptTemplate(
    input_variables=["user_input", "contexts"],
    template="用户问题: {user_input}\n\n基于以下内容回答用户问题:\n{contexts}"
)

ollama_llm = OllamaLLM(host=Config.OLLAMA_HOST, model=Config.LLM_MODEL)

def ollama_llm_wrapper(inputs: Union[dict, StringPromptValue]) -> Union[dict, Generator[dict, None, None]]:
    # 处理 StringPromptValue 对象，确保传递给模型的是字符串
    if isinstance(inputs, StringPromptValue):
        full_prompt = str(inputs)
        stream = False  # 假设流式处理在这种情况下不是必须的
    else:
        full_prompt = f"用户问题: {inputs['user_input']}\n\n基于以下内容回答用户问题:\n{inputs['contexts']}"
        stream = inputs.get("stream", False)

    return ollama_llm.call(full_prompt, stream=stream)

# 创建 RunnableSequence
sequence = RunnableSequence(
    prompt,  # 第一步生成 Prompt
    ollama_llm_wrapper  # 第二步执行 LLM
)

def retrieve_relevant_information(user_message: str) -> List[str]:
    try:
        with get_db_connection() as conn:
            with conn.cursor() as cursor:
                cursor.execute("SELECT data FROM knowledge_base WHERE data ILIKE %s LIMIT 5", ('%' + user_message + '%',))
                rows = cursor.fetchall()
        return [row['data'] for row in rows] if rows else []
    except Exception as e:
        print(f"Database error: {e}")
        return []

def get_model_response(user_message: str, stream: bool = False) -> Union[dict, Generator[dict, None, None]]:
    try:
        contexts = retrieve_relevant_information(user_message)
        combined_contexts = "\n".join(contexts)

        # 使用 sequence 执行，无论是流式还是非流式请求
        response = sequence.invoke({
            "user_input": user_message,
            "contexts": combined_contexts,
            "stream": stream
        })

        if stream:
            # 逐步返回流式响应
            return ({"choices": [{"message": {"content": line}}]} for line in response)

        # 确保 response 是字典格式，并且包含 expected content
        if isinstance(response, dict) and "choices" in response:
            response_content = response["choices"][0]["message"]["content"]
        else:
            response_content = "Unexpected response structure"

        return {"choices": [{"message": {"content": response_content}}]}

    except requests.RequestException as e:
        print(f"Request error: {e}")
        return ollama_llm._error_response("无法连接到LLM服务，请稍后重试。")
    except Exception as e:
        print(f"Error: {e}")
        return ollama_llm._error_response("处理请求时发生错误，请稍后重试。")
