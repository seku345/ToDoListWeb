from flask import Flask, jsonify, request
from flask_cors import CORS
from werkzeug.exceptions import NotFound, Conflict

from db.db import *
from db.requests.get import *
from db.requests.post import *
from db.requests.put import *
from db.requests.delete import *


app = Flask(__name__)
CORS(app)

DB_NAME = 'database'
create_db(DB_NAME)


@app.errorhandler(NotFound)
def handle_not_found_error(e):
    return jsonify({'error': 'Object not found'}), 404


@app.errorhandler(Conflict)
def handle_conflict_error(e):
    return jsonify({'error': 'There is a conflict with data!'}), 409


@app.route('/api/users', methods=['GET'])
def get_users():
    list_of_users = get_list_of_users(DB_NAME)
    list_of_dicts = list(map(lambda x: x.to_dict(), list_of_users))
    return jsonify(list_of_dicts)


@app.route('/api/<string:username>', methods=['GET'])
def get_user_info(username: str):
    user_data = get_user_data_from_db(DB_NAME, username)
    if user_data is None:
        raise NotFound
    return jsonify(user_data.to_dict())


@app.route('/api/<string:username>/tasks', methods=['GET'])
def get_user_tasks(username: str):
    list_of_tasks = get_list_of_tasks(DB_NAME, username)
    if list_of_tasks is None:
        raise NotFound
    list_of_dicts = list(map(lambda x: x.to_dict(), list_of_tasks))
    return jsonify(list_of_dicts)


@app.route('/api/<string:username>/tasks/sort/name/<int:rule>', methods=['GET'])
def sort_tasks_by_name(username: str, rule: int):
    list_of_tasks = get_sorted_by_name_list_of_tasks(DB_NAME, username, rule)
    if list_of_tasks is None:
        raise NotFound
    list_of_dicts = list(map(lambda x: x.to_dict(), list_of_tasks))
    return jsonify(list_of_dicts)


@app.route('/api/<string:username>/tasks/sort/date/<int:rule>', methods=['GET'])
def sort_tasks_by_date(username: str, rule: int):
    list_of_tasks = get_sorted_by_date_list_of_tasks(DB_NAME, username, rule)
    if list_of_tasks is None:
        raise NotFound
    list_of_dicts = list(map(lambda x: x.to_dict(), list_of_tasks))
    return jsonify(list_of_dicts)


@app.route('/api/<string:username>/tasks/sort/status/<int:rule>', methods=['GET'])
def sort_tasks_by_status(username: str, rule: int):
    list_of_tasks = get_sorted_by_status_list_of_tasks(DB_NAME, username, rule)
    if list_of_tasks is None:
        raise NotFound
    list_of_dicts = list(map(lambda x: x.to_dict(), list_of_tasks))
    return jsonify(list_of_dicts)


@app.route('/api/<string:username>/tasks/<int:task_id>', methods=['GET'])
def get_task_by_id(username: str, task_id: int):
    task_data = get_task_by_id_from_db(DB_NAME, username, task_id)
    if task_data is None:
        raise NotFound
    return jsonify(task_data.to_dict())


@app.route('/api/<string:username>/tasks/<int:task_id>/status', methods=['GET'])
def get_task_status(username: str, task_id: int):
    task_status = get_task_status_from_db(DB_NAME, username, task_id)
    if task_status is None:
        raise NotFound
    return jsonify({'result': task_status})


@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    if are_username_and_password_correct(DB_NAME, username, password):
        return jsonify({'message': 'User exists'})
    else:
        raise NotFound


@app.route('/api/registration', methods=['POST'])
def add_user():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    email = data.get('email')
    if not is_unique_user(DB_NAME, username):
        raise Conflict
    add_user_to_db(DB_NAME, username, email, password)
    return jsonify({'message': 'User added successfully!'})


@app.route('/api/<string:username>/tasks', methods=['POST'])
def add_task(username: str):
    data = request.get_json()
    task_name = data.get('task_name')
    task_description = data.get('task_description')
    task_time = data.get('task_time')
    task_date = data.get('task_date')
    if add_task_to_db(DB_NAME, username, task_name, task_description, task_date, task_time):
        raise NotFound
    return jsonify({'message': 'Task added successfully!'})


@app.route('/api/<string:username>', methods=['PUT'])
def edit_user_info(username: str):
    data = request.get_json()
    new_username = data.get('new_username')
    new_email = data.get('new_email')
    new_password = data.get('new_password')
    if edit_user_info_in_db(DB_NAME, username, new_username, new_email, new_password):
        raise NotFound
    return jsonify({'message': 'User info edited successfully!'})


@app.route('/api/<string:username>/tasks/<int:task_id>', methods=['PUT'])
def edit_task(username: str, task_id: int):
    data = request.get_json()
    new_task_name = data.get('task_name')
    new_task_description = data.get('task_description')
    new_task_time = data.get('task_time')
    new_task_date = data.get('task_date')
    if edit_task_in_db(DB_NAME, username, task_id, new_task_name, new_task_description, new_task_date, new_task_time):
        raise NotFound
    return jsonify({'message': 'Task edited successfully!'})


@app.route('/api/<string:username>/tasks/<int:task_id>/status', methods=['PUT'])
def switch_task_status(username: str, task_id: int):
    if switch_task_status_in_db(DB_NAME, username, task_id):
        raise NotFound
    return jsonify({'message': 'Status changed successfully!'})


@app.route('/api/<string:username>', methods=['DELETE'])
def delete_user(username: str):
    if delete_user_from_db(DB_NAME, username):
        raise NotFound
    return jsonify({'message': 'User deleted successfully!'})


@app.route('/api/<string:username>/tasks/<int:task_id>', methods=['DELETE'])
def delete_task(username: str, task_id: int):
    if delete_task_from_db(DB_NAME, username, task_id):
        raise NotFound
    return jsonify({'message': 'Task deleted successfully!'})


@app.route('/api/<string:username>/tasks', methods=['DELETE'])
def delete_user_tasks(username: str):
    if delete_user_tasks_from_db(DB_NAME, username):
        raise NotFound
    return jsonify({'message': 'User tasks deleted successfully!'})


@app.route('/api/delete', methods=['DELETE'])
def delete_all_data():
    clear_db(DB_NAME)
    return jsonify({'message': 'Data deleted successfully!'})


if __name__ == '__main__':
    app.run(debug=True)
