import sqlite3


def are_username_and_password_correct(name: str, username: str, password: str) -> bool:
    connection = sqlite3.connect(f'{name}.db')
    cursor = connection.cursor()

    cursor.execute('SELECT * FROM users WHERE username = ? AND password = ?',
                   (username, password))

    user_record = cursor.fetchone()
    if user_record is None:
        return False
    return True


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
