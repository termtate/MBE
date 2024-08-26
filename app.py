import requests
from flask import Flask, request, jsonify, send_from_directory,Response
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
import pickle
import psycopg2
from psycopg2.extras import RealDictCursor
from datetime import datetime

app = Flask(__name__, static_folder='static')

app.config['JWT_SECRET_KEY'] = 'stevebrokeadirtblock'
jwt = JWTManager(app)

#模型api设置
OLLAMA_HOST = "http://localhost:11434"
LLM_MODEL = "lgkt/llama3-chinese-alpaca:latest"

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
@app.route('/items', methods=['POST'])
@admin_required
def add_item():
    text = request.json.get('text')
    embedding = request.json.get('embedding')
    vector = request.json.get('vector')
    
    # 序列化 embedding 和 vector
    embedding_blob = pickle.dumps(embedding)
    vector_blob = pickle.dumps(vector)

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('INSERT INTO items (text, embedding, vector) VALUES (%s, %s, %s)',
                   (text, embedding_blob, vector_blob))
    conn.commit()
    cursor.close()
    conn.close()
    
    return jsonify({"msg": "Item added"}), 201

@app.route('/items', methods=['GET'])
@jwt_required()
def get_items():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM items')
    rows = cursor.fetchall()
    cursor.close()
    conn.close()

    items = []
    for row in rows:
        item = {
            "id": row["id"],
            "text": row["text"],
            "embedding": pickle.loads(row["embedding"]),
            "vector": pickle.loads(row["vector"])
        }
        items.append(item)
    
    return jsonify(items), 200

@app.route('/items/<int:item_id>', methods=['PUT'])
@admin_required
def update_item(item_id):
    data = request.json
    text = data.get('text')
    embedding = data.get('embedding')
    vector = data.get('vector')

    # 序列化 embedding 和 vector
    embedding_blob = pickle.dumps(embedding)
    vector_blob = pickle.dumps(vector)

    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute('UPDATE items SET text = %s, embedding = %s, vector = %s WHERE id = %s',
                   (text, embedding_blob, vector_blob, item_id))
    conn.commit()
    cursor.close()
    conn.close()
    
    return jsonify({"msg": "Item updated"}), 200

@app.route('/items/<int:item_id>', methods=['DELETE'])
@admin_required
def delete_item(item_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute('DELETE FROM items WHERE id = %s', (item_id,))
    conn.commit()
    cursor.close()
    conn.close()
    
    return jsonify({"msg": "Item deleted"}), 200

# 获取模型响应（非流式）
def get_model_response(user_message: str, stream: bool = False):
    try:
        response = requests.post(
            url=f"{OLLAMA_HOST}/v1/chat/completions",
            json={"model": LLM_MODEL, "messages": [{"role": "user", "content": user_message}], "stream": stream},
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
