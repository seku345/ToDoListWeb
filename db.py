import sqlite3
from typing import Optional

from classes import User, Task


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


def get_list_of_users(name: str) -> list[User]:
    connection = sqlite3.connect(f'{name}.db')
    cursor = connection.cursor()

    cursor.execute('SELECT * FROM users')

    list_of_users = list(map(lambda x: User(*x), cursor.fetchall()))

    connection.close()

    return list_of_users


def get_user_data_from_db(name: str, username: str) -> User | None:
    connection = sqlite3.connect(f'{name}.db')
    cursor = connection.cursor()

    cursor.execute('SELECT * FROM users WHERE username = ?', (username,))
    user_tuple: Optional[tuple[int, str, str, str]] = cursor.fetchone()

    connection.close()

    if user_tuple is None:
        return None

    user_id = user_tuple[0]
    user_username = user_tuple[1]
    user_email = user_tuple[2]
    user_password = user_tuple[3]

    user = User(user_id, user_username, user_email, user_password)

    return user


def get_list_of_tasks(name: str, username: str) -> list[Task] | None:
    connection = sqlite3.connect(f'{name}.db')
    cursor = connection.cursor()

    # getting the user id
    cursor.execute('SELECT user_id FROM users WHERE username = ?', (username,))
    user_record = cursor.fetchone()

    if user_record is None:
        connection.close()
        return None

    user_id = user_record[0]

    # getting the tasks of the required user
    cursor.execute('SELECT * FROM tasks WHERE user_id = ?', (user_id,))
    list_of_tasks = list(map(lambda x: Task(*x), cursor.fetchall()))

    connection.close()

    return list_of_tasks


def get_task_by_id_from_db(name: str, username: str, task_id: int) -> Task | None:
    connection = sqlite3.connect(f'{name}.db')
    cursor = connection.cursor()

    # getting user id
    cursor.execute('SELECT user_id FROM users WHERE username = ?', (username,))
    user_record = cursor.fetchone()

    if user_record is None:
        connection.close()
        return None

    user_id = user_record[0]

    cursor.execute('SELECT * FROM tasks WHERE task_id = ? AND user_id = ?', (task_id, user_id))

    task_tuple: Optional[tuple[int, int, str, str, str, str, str]] = cursor.fetchone()

    connection.close()

    if task_tuple is None:
        return None

    task_id = task_tuple[0]
    user_id = task_tuple[1]
    task_name = task_tuple[2]
    task_description = task_tuple[3]
    task_date = task_tuple[4]
    task_time = task_tuple[5]
    task_status = task_tuple[6]

    task = Task(task_id, user_id, task_name,
                task_description, task_date,
                task_time, task_status)

    return task


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


def add_user_to_db(name: str, username: str, email: str, password: str) -> None:
    connection = sqlite3.connect(f'{name}.db')
    cursor = connection.cursor()

    cursor.execute('INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
                   (username, email, password))

    connection.commit()
    connection.close()


def add_task_to_db(name: str, username: str, task_name: str,
                   task_description: str, task_date: str, task_time: str) -> bool:
    connection = sqlite3.connect(f'{name}.db')
    cursor = connection.cursor()

    # getting user id
    cursor.execute('SELECT user_id FROM users WHERE username = ?', (username,))
    user_record = cursor.fetchone()

    if user_record is None:
        connection.close()
        return True

    user_id = user_record[0]

    cursor.execute('''INSERT INTO tasks
                    (user_id, task_name, task_description, task_date, task_time)
                    VALUES (?, ?, ?, ?, ?)''',
                   (user_id, task_name, task_description, task_date, task_time))

    connection.commit()
    connection.close()

    return False


def delete_user_from_db(name: str, username: str) -> bool:
    connection = sqlite3.connect(f'{name}.db')
    cursor = connection.cursor()

    # getting user id
    cursor.execute('SELECT user_id FROM users WHERE username = ?', (username,))
    user_record = cursor.fetchone()

    if user_record is None:
        connection.close()
        return True

    user_id = user_record[0]

    # deleting user's tasks
    cursor.execute('DELETE FROM tasks WHERE user_id = ?', (user_id,))

    # deleting user
    cursor.execute('DELETE FROM users WHERE user_id = ?', (user_id,))

    connection.commit()
    connection.close()

    return False


def delete_task_from_db(name: str, username: str, task_id: int) -> bool:
    connection = sqlite3.connect(f'{name}.db')
    cursor = connection.cursor()

    # getting user id
    cursor.execute('SELECT user_id FROM users WHERE username = ?', (username,))
    user_record = cursor.fetchone()

    if user_record is None:
        connection.close()
        return True

    user_id = user_record[0]

    # checking if task exists
    cursor.execute('SELECT * FROM tasks WHERE task_id = ?', (task_id,))
    task = cursor.fetchone()

    if task is None:
        connection.close()
        return True

    cursor.execute('DELETE FROM tasks WHERE task_id = ? AND user_id = ?', (task_id, user_id))

    connection.commit()
    connection.close()

    return False


def delete_user_tasks_from_db(name: str, username: str) -> bool:
    connection = sqlite3.connect(f'{name}.db')
    cursor = connection.cursor()

    # getting user id
    cursor.execute('SELECT user_id FROM users WHERE username = ?', (username,))
    user_record = cursor.fetchone()

    if user_record is None:
        connection.close()
        return True

    user_id = user_record[0]

    cursor.execute('DELETE FROM tasks WHERE user_id = ?', (user_id,))

    connection.commit()
    connection.close()

    return False
