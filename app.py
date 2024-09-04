from flask import Flask, request, jsonify, send_from_directory, Response
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
import pickle
import psycopg2
import psycopg2.extras
from flask_cors import CORS
from config import Config
from functools import wraps
from Module_LLM import get_model_response
from utils import get_db_connection

app = Flask(__name__, static_folder='static')

app.config.from_object(Config)



jwt = JWTManager(app)
CORS(app)

def get_user(username):
    conn = get_db_connection()
    if conn is None:
        return None  
    with conn.cursor() as cursor:
        cursor.execute('SELECT * FROM users WHERE username = %s', (username,))
        return cursor.fetchone()


def create_user(username, password, role='user'):
    with get_db_connection() as conn:
        with conn.cursor() as cursor:
            cursor.execute('INSERT INTO users (username, password, role) VALUES (%s, %s, %s)', (username, password, role))
            conn.commit()

def admin_required(fn):
    @wraps(fn)
    @jwt_required()
    def wrapper(*args, **kwargs):
        current_user = get_jwt_identity()
        if current_user["role"] != "admin":
            return jsonify({"msg": "Admins only!"}), 403
        return fn(*args, **kwargs)
    return wrapper


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

@app.route('/users', methods=['GET'])
@jwt_required()
def get_users():
    with get_db_connection() as conn:
        with conn.cursor() as cursor:
            cursor.execute('SELECT id, username, role FROM users')
            users = cursor.fetchall()

    return jsonify(users)

@app.route('/users/<int:user_id>/role', methods=['PUT'])
@jwt_required()
def update_user_role(user_id):
    new_role = request.json.get('role')
    with get_db_connection() as conn:
        with conn.cursor() as cursor:
            cursor.execute('UPDATE users SET role = %s WHERE id = %s', (new_role, user_id))
            conn.commit()

    return jsonify({"msg": "User role updated"})

@app.route('/users/<int:user_id>/password', methods=['PUT'])
@jwt_required()
def update_user_password(user_id):
    new_password = request.json.get('password')
    with get_db_connection() as conn:
        with conn.cursor() as cursor:
            cursor.execute('UPDATE users SET password = %s WHERE id = %s', (new_password, user_id))
            conn.commit()

    return jsonify({"msg": "User password updated"})

@app.route('/users/<int:user_id>', methods=['DELETE'])
@jwt_required()
def delete_user(user_id):
    with get_db_connection() as conn:
        with conn.cursor() as cursor:
            cursor.execute('DELETE FROM users WHERE id = %s', (user_id,))
            conn.commit()

    return jsonify({"msg": "User deleted"})

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

@app.route('/stream-chat', methods=['POST'])
@jwt_required()
def stream_chat():
    user_message = request.json.get('message')

    def generate_response():
        for line in get_model_response(user_message, stream=True):
            if line:
                try:
                    yield f"data: {line.decode('utf-8')}\n\n"
                except UnicodeDecodeError:
                    yield f"data: [Error decoding response]\n\n"

    return Response(generate_response(), content_type='text/event-stream')

@app.route('/chat', methods=['POST'])
@jwt_required()
def chat():
    user_message = request.json.get('message')
    current_user = get_jwt_identity()

    if 'id' not in current_user:
        return jsonify({"msg": "User ID not found"}), 400

    # 确保 user_message 是 UTF-8 编码
    user_message = user_message.encode('utf-8').decode('utf-8')

    # 使用 get_model_response 生成响应
    model_response = get_model_response(user_message)
    if model_response is None:
        return jsonify({"msg": "Error generating response from model"}), 500

    response_text = model_response.get("choices", [{}])[0].get("message", {}).get("content", "")

    print("User Message:", user_message)
    print("Model Response:", response_text)

    with get_db_connection() as conn:
        with conn.cursor() as cursor:
            cursor.execute(
                "SET client_encoding = 'UTF8';"  # 设置客户端编码
            )
            cursor.execute(
                'INSERT INTO history (user_id, message, response, timestamp) VALUES (%s, %s, %s, NOW())',
                (current_user["id"], user_message, response_text)
            )
            conn.commit()

    return jsonify({"choices":{"message":{"role":"assitent","content": response_text}}})

@app.route('/api/chat-histories', methods=['GET'])
@jwt_required()
def get_chat_histories():
    current_user = get_jwt_identity()
    with get_db_connection() as conn:
        with conn.cursor(cursor_factory=psycopg2.extras.DictCursor) as cursor:
            cursor.execute("SELECT id, timestamp FROM history WHERE user_id = %s ORDER BY timestamp DESC", (current_user['id'],))
            chat_histories = cursor.fetchall()
            return jsonify([dict(row) for row in chat_histories])

@app.route('/chat-history/<int:history_id>', methods=['GET'])
@jwt_required()
def get_chat_history(history_id):
    current_user = get_jwt_identity()
    with get_db_connection() as conn:
        with conn.cursor(cursor_factory=psycopg2.extras.DictCursor) as cursor:
            cursor.execute("SELECT message, response FROM history WHERE id = %s AND user_id = %s", (history_id, current_user['id']))
            history = cursor.fetchall()
            if history:
                messages = [{'role': 'user', 'content': row['message']} if index % 2 == 0 else {'role': 'model', 'content': row['response']} for index, row in enumerate(history)]
                return jsonify({'messages': messages})
            else:
                return jsonify({'error': 'History not found'}), 404

@app.route('/api/chat-histories', methods=['POST'])
@jwt_required()
def create_chat_history():
    current_user = get_jwt_identity()
    data = request.json
    messages = data.get('messages', [])

    if not messages:
        return jsonify({"error": "No messages provided"}), 400

    with get_db_connection() as conn:
        with conn.cursor() as cursor:
            # 使用 RETURNING id 获取插入记录的 ID
            for message in messages:
                user_message = message["content"] if message["role"] == "user" else ""
                model_response = message["content"] if message["role"] == "model" else ""

                cursor.execute(
                    '''
                    INSERT INTO history (user_id, message, response, timestamp)
                    VALUES (%s, %s, %s, NOW())
                    RETURNING id
                    ''',
                    (
                        current_user["id"],
                        user_message if user_message else model_response,
                        model_response if user_message == "" else None
                    )
                )
                last_id = cursor.fetchone()[0]
            
            conn.commit()
            return jsonify({'id': last_id, 'timestamp': data['timestamp']}), 201



@app.route('/api/chat-histories/<int:chat_id>', methods=['DELETE'])
@jwt_required()
def delete_chat_history(chat_id):
    current_user = get_jwt_identity()
    with get_db_connection() as conn:
        with conn.cursor() as cursor:
            cursor.execute("DELETE FROM history WHERE id = %s AND user_id = %s", (chat_id, current_user['id']))
            conn.commit()
            return jsonify({'msg': 'Chat deleted'}), 200

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
