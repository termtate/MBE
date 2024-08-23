import sqlite3

# 连接到 SQLite 数据库
conn = sqlite3.connect('User_Storage.db')
cursor = conn.cursor()

# 创建表
cursor.execute('''
    CREATE TABLE items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        text TEXT NOT NULL,
        embedding BLOB,
        vector BLOB
);
''')

# 提交更改
conn.commit()
conn.close()
