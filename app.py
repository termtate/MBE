from flask import Flask, request, jsonify
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
import sqlite3
import pickle

app = Flask(__name__)
app.config['JWT_SECRET_KEY'] = 'stevebrokeadirtblock'
jwt = JWTManager(app)

# 数据库连接
def get_db_connection():
    conn = sqlite3.connect('rag_system.db')
    conn.row_factory = sqlite3.Row
    return conn

# 用户存储（实际应用中应使用数据库）
def create_user(username, password):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('INSERT INTO users (username, password) VALUES (?, ?)', (username, password))
    conn.commit()
    conn.close()

def get_user(username):
    conn = get_db_connection()
    cursor = conn.cursor()
    user = cursor.execute('SELECT * FROM users WHERE username = ?', (username,)).fetchone()
    conn.close()
    return user

@app.route('/register', methods=['POST'])
def register():
    username = request.json.get('username')
    password = request.json.get('password')
    
    if get_user(username):
        return jsonify({"msg": "User already exists"}), 400

    create_user(username, password)
    return jsonify({"msg": "User created"}), 201


@app.route('/login', methods=['POST'])
def login():
    username = request.json.get('username')
    password = request.json.get('password')
    user = get_user(username)
    
    if user and user['password'] == password:
        access_token = create_access_token(identity=username)
        return jsonify(access_token=access_token)
    else:
        return jsonify({"msg": "Bad username or password"}), 401


@app.route('/protected', methods=['GET'])
@jwt_required()
def protected():
    current_user = get_jwt_identity()
    return jsonify(logged_in_as=current_user), 200

@app.route('/items', methods=['POST'])
@jwt_required()
def add_item():
    text = request.json.get('text')
    embedding = request.json.get('embedding')
    vector = request.json.get('vector')
    
    # 序列化 embedding 和 vector
    embedding_blob = pickle.dumps(embedding)
    vector_blob = pickle.dumps(vector)

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('INSERT INTO items (text, embedding, vector) VALUES (?, ?, ?)',
                   (text, embedding_blob, vector_blob))
    conn.commit()
    conn.close()
    
    return jsonify({"msg": "Item added"}), 201

@app.route('/items', methods=['GET'])
@jwt_required()
def get_items():
    conn = get_db_connection()
    cursor = conn.cursor()
    rows = cursor.execute('SELECT * FROM items').fetchall()
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
@jwt_required()
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
    
    cursor.execute('UPDATE items SET text = ?, embedding = ?, vector = ? WHERE id = ?',
                   (text, embedding_blob, vector_blob, item_id))
    conn.commit()
    conn.close()
    
    return jsonify({"msg": "Item updated"}), 200

@app.route('/items/<int:item_id>', methods=['DELETE'])
@jwt_required()
def delete_item(item_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute('DELETE FROM items WHERE id = ?', (item_id,))
    conn.commit()
    conn.close()
    
    return jsonify({"msg": "Item deleted"}), 200


if __name__ == '__main__':
    app.run(debug=True)
