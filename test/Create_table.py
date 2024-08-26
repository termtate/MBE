import psycopg2
from psycopg2 import sql

# 数据库连接参数
DB_HOST = "localhost"
DB_NAME = "mbe_db"
DB_USER = "postgres"
DB_PASSWORD = "12345"

def create_tables():
    conn = None
    cursor = None
    try:
        # 连接到 PostgreSQL 数据库
        conn = psycopg2.connect(
            host=DB_HOST,
            database=DB_NAME,
            user=DB_USER,
            password=DB_PASSWORD
        )

        # 创建游标对象
        cursor = conn.cursor()

        # 创建 users 表的 SQL 语句
        create_users_table_query = '''
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            username TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            role TEXT CHECK (role IN ('user', 'admin')) NOT NULL
        );
        '''

        # 创建 knowledge_base 表的 SQL 语句
        create_knowledge_base_table_query = '''
        CREATE TABLE IF NOT EXISTS knowledge_base (
            id SERIAL PRIMARY KEY,
            data TEXT NOT NULL,
            embedding BYTEA,  -- 用于存储二进制的 embedding 向量
            created_at TIMESTAMPTZ DEFAULT NOW()
        );
        '''

        # 创建 history表的 SQL 语句
        create_history_table_query = '''
        CREATE TABLE IF NOT EXISTS history (
            id SERIAL PRIMARY KEY,
            user_id INTEGER REFERENCES users(id),
            message TEXT NOT NULL,
            response TEXT,
            timestamp TIMESTAMPTZ DEFAULT NOW()
        );
        '''

        # 执行创建表的 SQL 语句
        cursor.execute(create_users_table_query)
        cursor.execute(create_knowledge_base_table_query)
        cursor.execute(create_history_table_query)

        # 提交事务
        conn.commit()

        print("Tables created successfully!")

    except Exception as e:
        print(f"Error occurred: {e}")
    finally:
        # 关闭游标和连接
        if cursor is not None:
            cursor.close()
        if conn is not None:
            conn.close()

if __name__ == "__main__":
    create_tables()