import sqlite3


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
