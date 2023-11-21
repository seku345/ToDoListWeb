import sqlite3


def clear_db(name: str):
    connection = sqlite3.connect(f'{name}.db')
    cursor = connection.cursor()

    cursor.execute('DELETE FROM tasks')
    cursor.execute('DELETE FROM users')

    connection.commit()
    connection.close()


def create_db(name: str) -> None:
    connection = sqlite3.connect(f'{name}.db')
    cursor = connection.cursor()

    # user table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            user_id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL UNIQUE,
            email TEXT NOT NULL,
            password TEXT NOT NULL
        )
    ''')

    # task table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS tasks (
            task_id INTEGER PRIMARY KEY  AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            task_name TEXT NOT NULL,
            task_description TEXT,
            task_date DATE,
            task_time TIME(0),
            task_status CHAR(1) DEFAULT "✘"
        )
    ''')

    connection.commit()
    connection.close()


def is_unique_user(name: str, username: str) -> bool:
    connection = sqlite3.connect(f'{name}.db')
    cursor = connection.cursor()

    cursor.execute('SELECT * FROM users WHERE username = ?', (username,))
    user_record = cursor.fetchone()

    connection.close()

    if user_record is None:
        return True
    else:
        return False
