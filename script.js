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

// hide_all_children(login_form)
// hide_all_children(registration_form)
// hide_all_children(sign_out_block)
// hide_all_children(main_window)
// hide_all_children(user_info)
// hide_all_children(tasks_container)
// hide_all_children(task_info)

let current_user = null
let current_task = null

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
    if (!current_user == null) {
        from_login_form()
        from_registration_form()
        show_all_children(main_text)
    }
}

function to_login_form() {
    hide_all_children(main_text)
    show_all_children(login_form)
}

function from_login_form() {
    hide_all_children(login_form)
}

function to_registration_form() {
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
        display_error_message('Missing username!', 'error-username-miss-l')
        is_username_valid = false
    }

    else if (password.trim() === '') {
        display_error_message('Missing password!', 'error-password-miss-l')
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
        display_error_message('Missing username!', 'error-username-miss-r')
        is_username_valid = false
    }
    else if (password.trim() === '') {
        display_error_message('Missing password!', 'error-password-miss-r')
        is_password_valid = false
    }
    else if (email.trim() === '') {
        display_error_message('Missing email!', 'error-email-miss-r')
        is_email_valid = false
    }

    const sign_in_data = {
        username: username,
        password: password,
        email: email
    }

    form.reset()
    if (is_username_valid && is_password_valid && is_email_valid) {
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

    console.log(time === '', date === '')

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

}

document.getElementById('add-button-add').addEventListener('click', add_task)