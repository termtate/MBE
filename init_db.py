import sqlite3

def initialize_db():
    conn = sqlite3.connect('rag_system.db')
    cursor = conn.cursor()

    # 创建 users 表（用于用户认证）
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL
        )
    ''')

    # 创建 items 表（用于存储文本数据和向量）
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS items (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            text TEXT NOT NULL,
            embedding BLOB,
            vector BLOB
        )
    ''')

    conn.commit()
    conn.close()

if __name__ == '__main__':
    initialize_db()
