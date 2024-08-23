import sqlite3
import pickle

# 连接到 SQLite 数据库
conn = sqlite3.connect('rag_system.db')
cursor = conn.cursor()

# 查询数据
cursor.execute('SELECT * FROM items')
rows = cursor.fetchall()

for row in rows:
    id, text, embedding, vector = row
    print(f'ID: {id}, Text: {text}')
    embedding = pickle.loads(embedding)
    vector = pickle.loads(vector)
    print(f'Embedding: {embedding}, Vector: {vector}')

conn.close()
