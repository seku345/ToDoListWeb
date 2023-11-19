from flask import Flask, jsonify
from flask_cors import CORS

from db import create_db, get_user_data_from_db


app = Flask(__name__)
CORS(app)

DB_NAME = 'database'
create_db(DB_NAME)


@app.route('/api/<username>', methods=['GET'])
def get_user_info(username: str):
    user_data = get_user_data_from_db(DB_NAME, username).to_dict()
    return jsonify(user_data)


if __name__ == '__main__':
    app.run(debug=True)
