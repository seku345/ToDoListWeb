import sqlite3

from classes import User, Task


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


def get_list_of_tasks(name: str, username: str) -> list[Task]:
    connection = sqlite3.connect(f'{name}.db')
    cursor = connection.cursor()

    # getting the user id
    cursor.execute('SELECT user_id FROM users WHERE username = ?', (username,))
    user_id = cursor.fetchone()[0]

    # getting the tasks of the required user
    cursor.execute('SELECT * FROM tasks WHERE user_id = ?', (user_id,))
    list_of_tasks = list(map(lambda x: Task(*x), cursor.fetchall()))

    connection.close()

    return list_of_tasks

# TODO VALIDATION


def add_user_to_db(name: str, username: str, email: str, password: str) -> None:
    connection = sqlite3.connect(f'{name}.db')
    cursor = connection.cursor()

    cursor.execute('INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
                   (username, email, password))

    connection.commit()
    connection.close()


def delete_user_from_db(name: str, username: str) -> None:
    connection = sqlite3.connect(f'{name}.db')
    cursor = connection.cursor()

    # getting user id
    cursor.execute('SELECT user_id FROM users WHERE username = ?', (username,))
    user_id = cursor.fetchone()[0]

    # deleting user's tasks
    cursor.execute('DELETE FROM tasks WHERE user_id = ?', (user_id,))

    # deleting user
    cursor.execute('DELETE FROM users WHERE user_id = ?', (user_id,))

    connection.commit()
    connection.close()


def delete_task_from_db(name: str, task_id: int) -> None:
    connection = sqlite3.connect(f'{name}.db')
    cursor = connection.cursor()

    cursor.execute('DELETE FROM tasks WHERE task_id = ?', (task_id,))

    connection.commit()
    connection.close()
