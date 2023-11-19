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
