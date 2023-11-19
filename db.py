import sqlite3

from user import User


def create_db(name: str) -> None:
    connection = sqlite3.connect(f'{name}.db')
    cursor = connection.cursor()

    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            user_id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL UNIQUE,
            email TEXT NOT NULL,
            password TEXT NOT NULL
        )
    ''')

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


def get_user_data_from_db(name: str, username: str) -> User:
    connection = sqlite3.connect(f'{name}.db')
    cursor = connection.cursor()

    cursor.execute('SELECT * FROM users WHERE username = ?', (username,))
    user_tuple: tuple[int, str, str, str] = cursor.fetchone()

    connection.close()

    user_id = user_tuple[0]
    user_username = user_tuple[1]
    user_email = user_tuple[2]
    user_password = user_tuple[3]

    user = User(user_id, user_username, user_email, user_password)

    return user
