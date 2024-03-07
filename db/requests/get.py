import sqlite3
from typing import Optional

from classes import User, Task


def get_list_of_users(name: str) -> list[User] | None:
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


def get_sorted_by_name_list_of_tasks(name: str, username: str, rule: int) -> list[Task] | None:
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
    if rule == 1:
        cursor.execute('SELECT * FROM tasks WHERE user_id = ? ORDER BY task_name ASC', (user_id,))
    if rule == 2:
        cursor.execute('SELECT * FROM tasks WHERE user_id = ? ORDER BY task_name DESC', (user_id,))
    list_of_tasks = list(map(lambda x: Task(*x), cursor.fetchall()))

    connection.close()

    return list_of_tasks


def get_sorted_by_date_list_of_tasks(name: str, username: str, rule: int) -> list[Task] | None:
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
    if rule == 1:
        cursor.execute('SELECT * FROM tasks WHERE user_id = ? ORDER BY task_date ASC, task_time ASC', (user_id,))
    if rule == 2:
        cursor.execute('SELECT * FROM tasks WHERE user_id = ? ORDER BY task_date DESC, task_time DESC', (user_id,))
    list_of_tasks = list(map(lambda x: Task(*x), cursor.fetchall()))

    connection.close()

    return list_of_tasks


def get_sorted_by_status_list_of_tasks(name: str, username: str, rule: int) -> list[Task] | None:
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
    if rule == 1:
        cursor.execute('SELECT * FROM tasks WHERE user_id = ? ORDER BY task_status ASC', (user_id,))
    if rule == 2:
        cursor.execute('SELECT * FROM tasks WHERE user_id = ? ORDER BY task_status DESC', (user_id,))
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


def get_task_status_from_db(name: str, username: str, task_id: int) -> bool | None:
    connection = sqlite3.connect(f'{name}.db')
    cursor = connection.cursor()

    # getting user id
    cursor.execute('SELECT user_id FROM users WHERE username = ?', (username,))
    user_record = cursor.fetchone()

    if user_record is None:
        connection.close()
        return None

    user_id = user_record[0]

    cursor.execute('''SELECT task_status FROM tasks
                      WHERE task_id = ? AND user_id = ?''',
                   (task_id, user_id))

    status_record = cursor.fetchone()

    if status_record is None:
        connection.close()
        return None

    status = status_record[0]

    if status == '✔':
        return True
    if status == '✘':
        return False

    return None
