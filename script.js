main_text = document.getElementById('main-text')
login_form = document.getElementById('login-form-container')
registration_form = document.getElementById('registration-form-container')
user_info = document.getElementById('user-info')
header_buttons = document.getElementById('header-buttons')
sign_out_block = document.getElementById('sign-out-container')
tasks_container = document.getElementById('tasks')
task_info = document.getElementById('task-info')
main_window = document.getElementById('main-window')
adding_task_container = document.getElementById('adding-task-form-container')
task_title = document.getElementById('task-info-title')
task_description = document.getElementById('task-info-description')
task_date = document.getElementById('task-info-date')
task_time = document.getElementById('task-info-time')
editing_task_container = document.getElementById('editing-task-form-container')

let current_user = null
let current_task = null
let current_status = null
let task = {
    task_name: null,
    task_description: null,
    task_date: null,
    task_time: null
}

function show_all_children(parent) {
    parent.classList.remove('hidden')
    const children = parent.querySelectorAll('*')
    children.forEach(child => {
        child.classList.remove('hidden')
        if (child.children.length > 0) {
            show_all_children(child)
        }
    })
}

function hide_all_children(parent) {
    parent.classList.add('hidden')
    const children = parent.querySelectorAll('*')
    children.forEach(child => {
        child.classList.add('hidden')
        if (child.children.length > 0) {
            hide_all_children(child)
        }
    })
}

function to_start_window() {
    if (current_user == null) {
        from_login_form()
        from_registration_form()
        show_all_children(main_text)
    }
}

function to_login_form() {
    document.getElementById('l_form').reset()
    document.getElementById('r_form').reset()
    hide_all_children(main_text)
    show_all_children(login_form)
}

function from_login_form() {
    hide_all_children(login_form)
}

function to_registration_form() {
    document.getElementById('l_form').reset()
    document.getElementById('r_form').reset()
    hide_all_children(main_text)
    show_all_children(registration_form)
}

function from_registration_form() {
    hide_all_children(registration_form)
}

function display_error_message(message, error_element_id) {
    const error_message = document.getElementById(error_element_id)
    error_message.textContent = message
    error_message.classList.add('active')

    setTimeout(() => {
        error_message.classList.remove('active')
    }, 2500)
}

function login_submit(event) {
    event.preventDefault()

    const form = document.getElementById('l_form')
    const username = form.querySelector('input[name="username-input-l"]').value
    const password = form.querySelector('input[name="password-input-l"]').value

    let is_username_valid = true
    let is_password_valid = true

    if (username.trim() === '') {
        display_error_message('Missing username!', 'error-message-login')
        is_username_valid = false
    }

    else if (password.trim() === '') {
        display_error_message('Missing password!', 'error-message-login')
        is_password_valid = false
    }

    if (is_username_valid && is_password_valid) {
        const login_data = {
            username: username,
            password: password
        }

        form.reset()

        fetch(`http://127.0.0.1:5000/api/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(login_data)
            })
            .then(response => {
                if (!response.ok) {
                    display_error_message('Incorrect login or password!', 'error-message-login')
                    throw new Error('Incorrect login or password!')
                }
                return response.json()
            })
            .then(data => {
                current_user = username
                hide_all_children(login_form)
                show_all_children(main_window)
                hide_all_children(task_info)
                hide_all_children(adding_task_container)
                hide_all_children(editing_task_container)
                get_user_info()
                get_user_tasks()
            })
            .catch(error => {
                console.error('Error:', error)
            })
    }
}

document.getElementById('login_button').addEventListener('click', login_submit)

function registration_submit(event) {
    event.preventDefault()

    const form = document.getElementById('r_form')
    const username = form.querySelector('input[name="username-input-r"]').value
    const password = form.querySelector('input[name="password-input-r"]').value
    const email = form.querySelector('input[name="email-input-r"]').value

    let is_username_valid = true
    let is_password_valid = true
    let is_email_valid = true

    if (username.trim() === '') {
        display_error_message('Missing username!', 'error-message-registration')
        is_username_valid = false
    }
    else if (password.trim() === '') {
        display_error_message('Missing password!', 'error-message-registration')
        is_password_valid = false
    }
    else if (email.trim() === '') {
        display_error_message('Missing email!', 'error-message-registration')
        is_email_valid = false
    }

    const sign_in_data = {
        username: username,
        password: password,
        email: email
    }

    if (is_username_valid && is_password_valid && is_email_valid) {
        form.reset()
        fetch('http://127.0.0.1:5000/api/registration', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(sign_in_data)
        })
            .then(response => {
                if (!response.ok) {
                    display_error_message('Username is already taken!', 'error-message-registration')
                    throw new Error('Username is already taken!')
                }
                return response.json()
            })
            .then(data => {
                current_user = username
                hide_all_children(registration_form)
                show_all_children(main_window)
                hide_all_children(task_info)
                hide_all_children(adding_task_container)
                get_user_info()
                get_user_tasks()
            })
            .catch(error => {
                console.error('Error:', error)
            })
    }
}

document.getElementById('sign-up-button').addEventListener('click', registration_submit)

function get_user_info() {
    fetch(`http://127.0.0.1:5000/api/${current_user}`, {
        method: 'GET'
        })
        .then(response => response.json())
        .then(data => {
            document.getElementById('username_place').innerText = data.username
            document.getElementById('password_place').innerText = data.password
            document.getElementById('email_place').innerText = data.email
        })
        .catch(error => {
            console.error('Error:',error)
        })

    show_all_children(user_info)
    hide_all_children(header_buttons)
    show_all_children(sign_out_block)
}

function sign_out() {
    current_user = null
    hide_all_children(main_window)
    hide_all_children(sign_out_block)
    show_all_children(header_buttons)
    hide_all_children(user_info)
    show_all_children(main_text)
    hide_all_children(tasks_container)
}

function get_user_tasks() {
    is_big_desc = true
    show_task_description()
    fetch(`http://127.0.0.1:5000/api/${current_user}/tasks`, {
        method: 'GET'
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('There is some error...')
            }
            return response.json()
        })
        .then(data => {
            const task_body = document.getElementById('tasks-body')
            task_body.innerHTML = ''
            data.forEach(task => {
                const row = document.createElement('div')
                row.classList.add('tasks-row')
                row.onclick = () => get_task_info(task.id)
                row.innerHTML = `
                                 <div><p>${task.name}</p></div>
                                 <div><p>${task.description}</p></div>
                                 <div><p>${task.date}</p></div>
                                 <div><p>${task.time}</p></div>
                                 <div><p>${task.status}</p></div>`
                task_body.appendChild(row)
            })
        })
        .catch(error => {
            console.error('Error:', error)
        })
    show_all_children(tasks_container)
}

function get_task_info(task_id) {
    is_big_desc = true
    show_task_description()
    if (current_task === task_id) {
        hide_all_children(task_info)
        current_task = null
        return
    }
    current_task = task_id

    const name_place = document.getElementById('task_name_place')
    const description_place = document.getElementById('task_description_place')
    const date_place = document.getElementById('task_date_place')
    const time_place = document.getElementById('task_time_place')
    const label = document.getElementById('status-button-radio-label')

    fetch(`http://127.0.0.1:5000/api/${current_user}/tasks/${task_id}`, {
        method: 'GET'
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Getting task error!')
            }
            return response.json()
        })
        .then(data => {
            name_place.innerText = data.name
            description_place.innerText = data.description
            date_place.innerText = data.date
            time_place.innerText = data.time
            task.task_name = data.name
            task.task_description = data.description
            task.task_date = data.date
            task.task_time = data.time
            current_status = (data.status === '✔')
            if (current_status) {
                label.style.background = 'white'
            } else {
                label.style.background = ''
            }
        })
        .catch(error => {
            console.error('Error:', error)
        })
    show_all_children(task_info)
}

function  to_adding_task() {
    hide_all_children(tasks_container)
    hide_all_children(task_info)
    show_all_children(adding_task_container)
}

function back_to_task_list(event) {
    event.preventDefault()
    const form = document.getElementById('add-task-form')
    form.reset()
    hide_all_children(adding_task_container)
    get_user_tasks()
}

document.getElementById('back-button-add').addEventListener('click', back_to_task_list)

function add_task(event) {
    event.preventDefault()

    const form = document.getElementById('add-task-form')
    const title = form.querySelector('input[name="task_name"]').value
    const description = form.querySelector('textarea[name="task_description"]').value
    const time = form.querySelector('input[name="task_time"]').value
    const date = form.querySelector('input[name="task_date"]').value

    if (title.trim() === '') {
        display_error_message('Missing Task Title!', 'error-message-add')
    } else {

        const task_data = {
            task_name: title,
            task_description: description,
            task_time: time,
            task_date: date
        }

        fetch(`http://127.0.0.1:5000/api/${current_user}/tasks`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(task_data)
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error with adding new task')
                }
                return response.json()
            })
            .then(data => {
                back_to_task_list(event)
            })
            .catch(error => {
                console.error("Error:", error)
            })
    }
}

document.getElementById('add-button-add').addEventListener('click', add_task)

// TODO NEW SPLIT LOGIC
document.getElementById('task_description').addEventListener('input', () => {
    const lines = document.getElementById('task_description').value.split('\n')
    const max_rows = 7

    if (lines.length > max_rows) {
        document.getElementById('task_description').value = lines.splice(0, max_rows).join('\n')
    }
})

function change_task_status(event) {
    event.preventDefault()

    fetch(`http://127.0.0.1:5000/api/${current_user}/tasks/${current_task}/status`, {
        method: 'PUT',
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Changing task status error')
            }
            return response.json()
        })
        .then(data => {
            const label = document.getElementById('status-button-radio-label')
            if (current_status === true) {
                label.style.background = ''
                current_status = false
            } else if (current_status === false) {
                label.style.background = 'white'
                current_status = true
            } else {
                throw new Error('Status error')
            }
            if (!is_editing_task) {
                get_user_tasks()
            }
        })
        .catch(error => {
            console.error('Error:', error)
        })
}

document.getElementById('status-button-radio-label').addEventListener('click', change_task_status)

function delete_task() {
    fetch(`http://127.0.0.1:5000/api/${current_user}/tasks/${current_task}`, {
        method: 'DELETE',
    })
        .then(response => {
            if (!response.ok) {
                throw new Error("Delete task error")
            }
            return response.json()
        })
        .then(data => {
            get_user_tasks()
            hide_all_children(task_info)
            hide_all_children(editing_task_container)
            is_editing_task = false
            current_task = null
        })
        .catch(error => {
            console.error('Error:', error)
        })
}

document.getElementById('delete-button').addEventListener('click', delete_task)

let is_big_desc = false
function show_task_description() {
    if (!is_big_desc) {
        hide_all_children(task_title)
        hide_all_children(task_date)
        hide_all_children(task_time)
        task_description.classList.add('task-description-extended')
        task_date.classList.add('task-date-extended')
        task_time.classList.add('task-time-extended')
        is_big_desc = true
    } else {
        show_all_children(task_title)
        show_all_children(task_date)
        show_all_children(task_time)
        task_description.classList.remove('task-description-extended')
        task_date.classList.remove('task-date-extended')
        task_time.classList.remove('task-time-extended')
        is_big_desc = false
    }
}

document.getElementById('more-button').addEventListener('click', show_task_description)

let is_editing_task = false

document.getElementById('edit-button').addEventListener('click', (event) => {
    if (is_editing_task) {
        back_to_task_info(event)
        is_editing_task = false
    } else {
        to_editing_task()
        is_editing_task = true
    }
})

function  to_editing_task() {
    hide_all_children(tasks_container)
    document.getElementById('task_name_e').value = task.task_name
    document.getElementById('task_description_e').value = task.task_description
    document.getElementById('task_date_e').value = task.task_date
    document.getElementById('task_time_e').value = task.task_time
    show_all_children(editing_task_container)
}

function back_to_task_info(event) {
    event.preventDefault()
    is_editing_task = false
    document.getElementById('task_name_e').value = task.task_name
    document.getElementById('task_description_e').value = task.task_description
    document.getElementById('task_date_e').value = task.task_date
    document.getElementById('task_time_e').value = task.task_time
    hide_all_children(editing_task_container)
    get_user_tasks()
}

document.getElementById('back-button-edit').addEventListener('click', back_to_task_info)

function edit_task(event) {
    event.preventDefault()

    const title = document.getElementById('task_name_e').value
    const description = document.getElementById('task_description_e').value
    const time = document.getElementById('task_time_e').value
    const date = document.getElementById('task_date_e').value

    if (title.trim() === '') {
        display_error_message('Missing Task Title!', 'error-message-edit')
    } else {

        const task_data = {
            task_name: title,
            task_description: description,
            task_time: time,
            task_date: date
        }

        fetch(`http://127.0.0.1:5000/api/${current_user}/tasks/${current_task}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(task_data)
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error with editing the task')
                }
                return response.json()
            })
            .then(data => {
                task.name = title
                task.description = description
                task.date = date
                task.time = time
                is_editing_task = false
                back_to_task_info(event)
                const temp = current_task;
                current_task = null
                get_task_info(temp)
            })
            .catch(error => {
                console.error("Error:", error)
            })
    }
}

document.getElementById('save-button').addEventListener('click', edit_task)