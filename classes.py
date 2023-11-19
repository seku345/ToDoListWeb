class User:
    def __init__(self, user_id: int, username: str, email: str, password: str) -> None:
        self.id = user_id
        self.username = username
        self.email = email
        self.password = password

    def to_dict(self) -> dict[str, str | int]:
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'password': self.password,
        }


class Task:
    def __init__(self, task_id: int, user_id: int, task_name: str, task_description: str,
                 task_date: str, task_time: str, task_status: str) -> None:
        self.id = task_id
        self.user_id = user_id
        self.name = task_name
        self.description = task_description
        self.date = task_date
        self.time = task_time
        self.status = task_status

    def to_dict(self) -> dict[str, str | int]:
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'date': self.date,
            'time': self.time,
            'status': self.status,
        }
