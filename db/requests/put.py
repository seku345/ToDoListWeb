import sqlite3


def edit_user_info_in_db(name: str, username: str, new_username: str, new_email: str, new_password: str) -> bool:
    connection = sqlite3.connect(f'{name}.db')
    cursor = connection.cursor()

    # checking if username exists
    cursor.execute('SELECT user_id FROM users WHERE username = ?', (username,))
    user_record = cursor.fetchone()

    if user_record is None:
        connection.close()
        return True

    user_id = user_record[0]

    cursor.execute('''UPDATE users SET username = ?,
                                   email = ?,
                                   password = ?
                      WHERE user_id = ?''',
                   (new_username, new_email, new_password, user_id))

    connection.commit()
    connection.close()

    return False


def edit_task_in_db(name: str, username: str, task_id: int, new_name: str, new_description: str, new_date: str, new_time: str) -> bool:
    connection = sqlite3.connect(f'{name}.db')
    cursor = connection.cursor()

    # getting user id
    cursor.execute('SELECT user_id FROM users WHERE username = ?', (username,))
    user_record = cursor.fetchone()

    if user_record is None:
        return True

    user_id = user_record[0]

    # checking if task exits
    cursor.execute('SELECT * FROM tasks WHERE task_id = ?', (task_id,))
    task_record = cursor.fetchone()

    if task_record is None:
        return True

    cursor.execute('''UPDATE tasks SET task_name = ?,
                                       task_description = ?,
                                       task_date = ?,
                                       task_time = ?
                      WHERE task_id = ? AND user_id = ?''',
                   (new_name, new_description, new_date, new_time, task_id, user_id))

    connection.commit()
    connection.close()

    return False