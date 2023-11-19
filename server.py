from flask import Flask, jsonify, request
from flask_cors import CORS

from db import *


app = Flask(__name__)
CORS(app)

DB_NAME = 'database'
create_db(DB_NAME)


@app.route('/api/<string:username>', methods=['GET'])
def get_user_info(username: str):
    user_data = get_user_data_from_db(DB_NAME, username).to_dict()
    return jsonify(user_data)


@app.route('/api/<string:username>/tasks', methods=['GET'])
def get_user_tasks(username: str):
    list_of_tasks = get_list_of_tasks(DB_NAME, username)
    list_of_dicts = list(map(lambda x: x.to_dict(), list_of_tasks))
    return jsonify(list_of_dicts)


@app.route('/api/registration', methods=['POST'])
def add_user():
    username = request.form['username']
    email = request.form['email']
    password = request.form['password']
    add_user_to_db(DB_NAME, username, email, password)
    return jsonify({'message': 'User added successfully!'})


@app.route('/api/<string:username>', methods=['DELETE'])
def delete_user(username: str):
    delete_user_from_db(DB_NAME, username)
    return jsonify({'message': 'User deleted successfully!'})


@app.route('/api/<string:username>/tasks/<int:task_id>', methods=['DELETE'])
def delete_task(username: str, task_id: int):
    delete_task_from_db(DB_NAME, task_id)
    return jsonify({'message': 'Task deleted successfully!'})


if __name__ == '__main__':
    app.run(debug=True)
