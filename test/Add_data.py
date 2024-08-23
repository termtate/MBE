import sqlite3
import pickle

# 连接到 SQLite 数据库
conn = sqlite3.connect('rag_system.db')
cursor = conn.cursor()

# 示例文本数据、embedding 和 vector
text = "Sample text"
embedding = pickle.dumps([0.1, 0.2, 0.3])  # 示例 embedding 向量
vector = pickle.dumps([1, 2, 3])           # 示例关键词向量

# 插入数据
cursor.execute('''
    INSERT INTO items (text, embedding, vector)
    VALUES (?, ?, ?)
''', (text, embedding, vector))

# 提交更改
conn.commit()
conn.close()
