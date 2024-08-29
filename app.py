import requests
from flask import Flask, request, jsonify, send_from_directory, Response
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
import pickle
import psycopg2
from psycopg2.extras import RealDictCursor
from flask_cors import CORS

app = Flask(__name__, static_folder='static')

app.config['JWT_SECRET_KEY'] = 'stevebrokeadirtblock'
jwt = JWTManager(app)
CORS(app)  # 将 CORS 设置移到 app.run() 之前

# 模型 API 设置
OLLAMA_HOST = "http://localhost:11434"
LLM_MODEL = "lgkt/llama3-chinese-alpaca:latest"

# 数据库连接函数
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

# 获取用户信息
def get_user(username):
    with get_db_connection() as conn:
        with conn.cursor() as cursor:
            cursor.execute('SELECT * FROM users WHERE username = %s', (username,))
            return cursor.fetchone()

# 创建用户
def create_user(username, password, role='user'):
    with get_db_connection() as conn:
        with conn.cursor() as cursor:
            cursor.execute('INSERT INTO users (username, password, role) VALUES (%s, %s, %s)', (username, password, role))
            conn.commit()

# JWT 中间件，用于管理员权限验证
def admin_required(fn):
    @jwt_required()
    def wrapper(*args, **kwargs):
        current_user = get_jwt_identity()
        if current_user["role"] != "admin":
            return jsonify({"msg": "Admins only!"}), 403
        return fn(*args, **kwargs)
    wrapper.__name__ = fn.__name__
    return wrapper

# 登录路由
@app.route('/login', methods=['POST'])
def login():
    username = request.json.get('username')
    password = request.json.get('password')
    user = get_user(username)
    
    if user and user['password'] == password:
        access_token = create_access_token(identity={"username": username, "role": user["role"], "id": user["id"]})
        return jsonify({"access_token": access_token}), 200
    else:
        return jsonify({"msg": "Bad username or password"}), 401

# 注册路由
@app.route('/register', methods=['POST'])
def register():
    username = request.json.get('username')
    password = request.json.get('password')

    if get_user(username):
        return jsonify({"msg": "User already exists"}), 400

    with get_db_connection() as conn:
        with conn.cursor() as cursor:
            cursor.execute('SELECT COUNT(*) FROM users')
            user_count = cursor.fetchone()['count']

            role = 'admin' if user_count == 0 else 'user'
            create_user(username, password, role)

    return jsonify({"msg": "User created", "role": role}), 201

# 获取所有用户
@app.route('/users', methods=['GET'])
@jwt_required()
def get_users():
    with get_db_connection() as conn:
        with conn.cursor() as cursor:
            cursor.execute('SELECT id, username, role FROM users')
            users = cursor.fetchall()

    return jsonify(users)

# 修改用户角色
@app.route('/users/<int:user_id>/role', methods=['PUT'])
@jwt_required()
def update_user_role(user_id):
    new_role = request.json.get('role')
    with get_db_connection() as conn:
        with conn.cursor() as cursor:
            cursor.execute('UPDATE users SET role = %s WHERE id = %s', (new_role, user_id))
            conn.commit()

    return jsonify({"msg": "User role updated"})

# 修改用户密码
@app.route('/users/<int:user_id>/password', methods=['PUT'])
@jwt_required()
def update_user_password(user_id):
    new_password = request.json.get('password')
    with get_db_connection() as conn:
        with conn.cursor() as cursor:
            cursor.execute('UPDATE users SET password = %s WHERE id = %s', (new_password, user_id))
            conn.commit()

    return jsonify({"msg": "User password updated"})

# 删除用户
@app.route('/users/<int:user_id>', methods=['DELETE'])
@jwt_required()
def delete_user(user_id):
    with get_db_connection() as conn:
        with conn.cursor() as cursor:
            cursor.execute('DELETE FROM users WHERE id = %s', (user_id,))
            conn.commit()

    return jsonify({"msg": "User deleted"})

# 数据管理功能仅限管理员使用
@app.route('/knowledge_base', methods=['POST'])
@admin_required
def add_knowledge_base_entry():
    data = request.json.get('data')
    embedding = request.json.get('embedding')

    embedding_blob = pickle.dumps(embedding)

    with get_db_connection() as conn:
        with conn.cursor() as cursor:
            cursor.execute(
                'INSERT INTO knowledge_base (data, embedding, created_at) VALUES (%s, %s, NOW())',
                (data, embedding_blob)
            )
            conn.commit()

    return jsonify({"msg": "Entry added to knowledge_base"}), 201

@app.route('/knowledge_base', methods=['GET'])
@jwt_required()
def get_knowledge_base_entries():
    search_keyword = request.args.get('keyword', '')

    with get_db_connection() as conn:
        with conn.cursor() as cursor:
            if search_keyword:
                cursor.execute(
                    "SELECT id, data, embedding, created_at FROM knowledge_base WHERE data ILIKE %s",
                    ('%' + search_keyword + '%',)
                )
            else:
                cursor.execute("SELECT id, data, embedding, created_at FROM knowledge_base")

            rows = cursor.fetchall()

    entries = [
        {
            "id": row["id"],
            "data": row["data"],
            "embedding": pickle.loads(row["embedding"]) if row["embedding"] else None,
            "created_at": row["created_at"]
        }
        for row in rows
    ]

    return jsonify(entries), 200

@app.route('/knowledge_base/<int:entry_id>', methods=['PUT'])
@admin_required
def update_knowledge_base_entry(entry_id):
    data = request.json.get('data')
    embedding = request.json.get('embedding')

    embedding_blob = pickle.dumps(embedding)

    with get_db_connection() as conn:
        with conn.cursor() as cursor:
            cursor.execute(
                'UPDATE knowledge_base SET data = %s, embedding = %s WHERE id = %s',
                (data, embedding_blob, entry_id)
            )
            conn.commit()

    return jsonify({"msg": "Entry updated"}), 200

@app.route('/knowledge_base/<int:entry_id>', methods=['DELETE'])
@admin_required
def delete_knowledge_base_entry(entry_id):
    with get_db_connection() as conn:
        with conn.cursor() as cursor:
            cursor.execute('DELETE FROM knowledge_base WHERE id = %s', (entry_id,))
            conn.commit()

    return jsonify({"msg": "Entry deleted"}), 200

# 检索相关上下文
def retrieve_relevant_information(user_message):
    with get_db_connection() as conn:
        with conn.cursor() as cursor:
            cursor.execute("SELECT data FROM knowledge_base WHERE data ILIKE %s LIMIT 5", ('%' + user_message + '%',))
            rows = cursor.fetchall()

    contexts = [row['data'] for row in rows]
    return contexts

# 获取模型响应
def get_model_response(user_message: str, stream: bool = False):
    try:
        contexts = retrieve_relevant_information(user_message)
        combined_message = (
            "你需要根据你学习到的内容回答的问题：" "\n" + user_message +
            "\n\n" + "后方的内容是你学习到的知识，请基于这些信息回答用户问题:" + "\n".join(contexts)
        )

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

    model_response = get_model_response(user_message, stream=False)

    with get_db_connection() as conn:
        with conn.cursor() as cursor:
            cursor.execute(
                'INSERT INTO history (user_id, message, response, timestamp) VALUES (%s, %s, %s, NOW())',
                (current_user["id"], user_message, model_response["choices"][0]["message"]["content"])
            )
            conn.commit()

    return jsonify(model_response)

# 静态文件处理
@app.route('/')
def index():
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/<path:path>')
def catch_all(path):
    if path.startswith(('js', 'css', 'img', 'favicon.ico')):
        return send_from_directory(app.static_folder, path)
    return send_from_directory(app.static_folder, 'index.html')

if __name__ == '__main__':
    app.run(debug=True)
