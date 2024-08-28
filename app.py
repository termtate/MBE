import requests
from flask import Flask, request, jsonify, send_from_directory,Response
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
import pickle
import psycopg2
from psycopg2.extras import RealDictCursor
from datetime import datetime
from flask_cors import CORS

app = Flask(__name__, static_folder='static')

app.config['JWT_SECRET_KEY'] = 'stevebrokeadirtblock'
jwt = JWTManager(app)

#模型api设置
OLLAMA_HOST = "http://localhost:11434"
LLM_MODEL = "lgkt/llama3-chinese-alpaca:latest"
PROMPT= "后方的内容是你学习到的知识，请基于这些信息回答用户问题"

# 数据库连接
def get_db_connection():
    try:
        conn = psycopg2.connect(
            host="localhost",
            database="mbe_db",
            user="postgres",
            password="12345",
            cursor_factory=RealDictCursor
        )
        return conn
    except Exception as e:
        print(f"数据库连接失败: {e}")
        return None


# 获取所有用户
@app.route('/users', methods=['GET'])
@jwt_required()
def get_users():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT id, username, role FROM users')
    users = cursor.fetchall()
    cursor.close()
    conn.close()

    return jsonify(users)

# 修改用户角色
@app.route('/users/<int:user_id>/role', methods=['PUT'])
@jwt_required()
def update_user_role(user_id):
    new_role = request.json.get('role')
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('UPDATE users SET role = %s WHERE id = %s', (new_role, user_id))
    conn.commit()
    cursor.close()
    conn.close()

    return jsonify({"msg": "User role updated"})

# 修改用户密码
@app.route('/users/<int:user_id>/password', methods=['PUT'])
@jwt_required()
def update_user_password(user_id):
    new_password = request.json.get('password')
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('UPDATE users SET password = %s WHERE id = %s', (new_password, user_id))
    conn.commit()
    cursor.close()
    conn.close()

    return jsonify({"msg": "User password updated"})

# 删除用户
@app.route('/users/<int:user_id>', methods=['DELETE'])
@jwt_required()
def delete_user(user_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('DELETE FROM users WHERE id = %s', (user_id,))
    conn.commit()
    cursor.close()
    conn.close()

    return jsonify({"msg": "User deleted"})

# 用户存储（实际应用中应使用数据库）
def create_user(username, password, role='user'):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('INSERT INTO users (username, password, role) VALUES (%s, %s, %s)', (username, password, role))
    conn.commit()
    cursor.close()
    conn.close()

def get_user(username):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM users WHERE username = %s', (username,))
    user = cursor.fetchone()
    cursor.close()
    conn.close()
    return user

# 检查是否为管理员
def admin_required(fn):
    @jwt_required()
    def wrapper(*args, **kwargs):
        current_user = get_jwt_identity()
        if current_user["role"] != "admin":
            return jsonify({"msg": "Admins only!"}), 403
        return fn(*args, **kwargs)
    wrapper.__name__ = fn.__name__
    return wrapper

@app.route('/')
def index():
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/<path:path>')
def catch_all(path):
    # 如果请求的是静态文件（如 JS、CSS），直接提供这些文件
    if path.startswith('js') or path.startswith('css') or path.startswith('img') or path.startswith('favicon.ico'):
        return send_from_directory(app.static_folder, path)
    # 其他路径交给 Vue.js 处理
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/register', methods=['POST'])
def register():
    username = request.json.get('username')
    password = request.json.get('password')
    
    conn = get_db_connection()
    cursor = conn.cursor()

    # 检查是否已经存在用户
    cursor.execute('SELECT COUNT(*) FROM users')
    result = cursor.fetchone()

    # 处理不同类型的返回值
    if isinstance(result, dict):
        user_count = result.get('count', 0)  # 如果是字典，获取 'count' 键
    elif isinstance(result, tuple):
        user_count = result[0]  # 如果是元组，获取第一个元素
    else:
        user_count = 0  # 默认值

    # 如果没有用户，则第一个用户为管理员
    role = 'admin' if user_count == 0 else 'user'
    
    if get_user(username):
        return jsonify({"msg": "User already exists"}), 400

    create_user(username, password, role)
    conn.commit()
    cursor.close()
    conn.close()
    
    return jsonify({"msg": "User created", "role": role}), 201


@app.route('/login', methods=['POST'])
def login():
    username = request.json.get('username')
    password = request.json.get('password')
    user = get_user(username)
    
    if user and user['password'] == password:
        # 确保在 JWT 中包含用户的 id
        access_token = create_access_token(identity={"username": username, "role": user["role"], "id": user["id"]})
        return jsonify(access_token=access_token)
    else:
        return jsonify({"msg": "Bad username or password"}), 401


@app.route('/protected', methods=['GET'])
@jwt_required()
def protected():
    current_user = get_jwt_identity()
    return jsonify(logged_in_as=current_user), 200

# 数据管理功能仅限管理员使用
@app.route('/knowledge_base', methods=['POST'])
@admin_required
def add_knowledge_base_entry():
    data = request.json.get('data')
    embedding = request.json.get('embedding')

    # 序列化 embedding
    embedding_blob = pickle.dumps(embedding)

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        'INSERT INTO knowledge_base (data, embedding, created_at) VALUES (%s, %s, NOW())',
        (data, embedding_blob)
    )
    conn.commit()
    cursor.close()
    conn.close()

    return jsonify({"msg": "Entry added to knowledge_base"}), 201

@app.route('/knowledge_base', methods=['GET'])
@jwt_required()
def get_knowledge_base_entries():
    search_keyword = request.args.get('keyword', '')

    conn = get_db_connection()
    cursor = conn.cursor()

    if search_keyword:
        cursor.execute(
            "SELECT id, data, embedding, created_at FROM knowledge_base WHERE data ILIKE %s",
            ('%' + search_keyword + '%',)
        )
    else:
        cursor.execute("SELECT id, data, embedding, created_at FROM knowledge_base")

    rows = cursor.fetchall()
    cursor.close()
    conn.close()

    entries = []
    for row in rows:
        entry = {
            "id": row["id"],
            "data": row["data"],
            "embedding": pickle.loads(row["embedding"]) if row["embedding"] else None,
            "created_at": row["created_at"]
        }
        entries.append(entry)

    return jsonify(entries), 200


@app.route('/knowledge_base/<int:entry_id>', methods=['PUT'])
@admin_required
def update_knowledge_base_entry(entry_id):
    data = request.json.get('data')
    embedding = request.json.get('embedding')

    # 序列化 embedding
    embedding_blob = pickle.dumps(embedding)

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        'UPDATE knowledge_base SET data = %s, embedding = %s WHERE id = %s',
        (data, embedding_blob, entry_id)
    )
    conn.commit()
    cursor.close()
    conn.close()

    return jsonify({"msg": "Entry updated"}), 200

@app.route('/knowledge_base/<int:entry_id>', methods=['DELETE'])
@admin_required
def delete_knowledge_base_entry(entry_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('DELETE FROM knowledge_base WHERE id = %s', (entry_id,))
    conn.commit()
    cursor.close()
    conn.close()

    return jsonify({"msg": "Entry deleted"}), 200


# 检索相关上下文
def retrieve_relevant_information(user_message):
    conn = get_db_connection()
    cursor = conn.cursor()

    # 假设使用 SQL 进行简单的文本匹配查询
    cursor.execute("SELECT data FROM knowledge_base WHERE data ILIKE %s LIMIT 5", ('%' + user_message + '%',))
    rows = cursor.fetchall()
    print("Retrieved rows:", rows)
    
    cursor.close()
    conn.close()

    # 提取数据作为上下文
    contexts = [row['data'] for row in rows]
    return contexts

# 获取模型响应，并将上下文拼接到用户输入后发送给模型
def get_model_response(user_message: str, stream: bool = False):
    try:
        # 检索相关上下文
        contexts = retrieve_relevant_information(user_message)
        
        # 将上下文与用户输入拼接，作为提示词
        combined_message = "你需要根据你学习到的内容回答的问题：" "\n" + user_message + "\n\n" + "后方的内容是你学习到的知识，请基于这些信息回答用户问题:" + "\n".join(contexts)
        print("Combined Message: ", combined_message)
        # 发送到模型
        response = requests.post(
            url=f"{OLLAMA_HOST}/v1/chat/completions",
            json={"model": LLM_MODEL, "messages": [{"role": "user", "content": combined_message}], "stream": stream},
            stream=stream
        )
        response.raise_for_status()

        if stream:
            return response.iter_lines()
        else:
            return response.json()
    except Exception as e:
        return f"Error: {e}"

# 流式传输的聊天接口
@app.route('/stream-chat', methods=['POST'])
@jwt_required()
def stream_chat():
    user_message = request.json.get('message')
    current_user = get_jwt_identity()

    # 使用流式传输获取模型响应
    def generate_response():
        for line in get_model_response(user_message, stream=True):
            if line:
                yield f"data: {line.decode('utf-8')}\n\n"

    return Response(generate_response(), content_type='text/event-stream')

# 非流式传输的聊天接口
@app.route('/chat', methods=['POST'])
@jwt_required()
def chat():
    user_message = request.json.get('message')
    current_user = get_jwt_identity()

    if 'id' not in current_user:
        return jsonify({"msg": "User ID not found"}), 400
   
    # 获取模型的完整响应
    model_response = get_model_response(user_message, stream=False)

    # 存储聊天记录
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        'INSERT INTO history (user_id, message, response, timestamp) VALUES (%s, %s, %s, NOW())',
        (current_user["id"], user_message, model_response["choices"][0]["message"]["content"])
    )
    conn.commit()
    cursor.close()
    conn.close()

    return jsonify(model_response)

if __name__ == '__main__':
    app.run(debug=True)
    CORS(app)
