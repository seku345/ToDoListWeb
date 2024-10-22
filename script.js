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
change_password_container = document.getElementById('change-password-container')
name_sort_arrow = document.getElementById('name-sort-arrow')
datetime_sort_arrow = document.getElementById('datetime-sort-arrow')
status_sort_arrow = document.getElementById('status-sort-arrow')
undo_button = document.getElementById('undo-button')

let current_user = null
let current_email = null
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
                hide_all_children(editing_task_container)
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
            current_email = data.email
        })
        .catch(error => {
            console.error('Error:', error)
        })

    show_all_children(user_info)
    hide_all_children(header_buttons)
    hide_all_children(change_password_container)
    show_all_children(sign_out_block)
}

function sign_out() {
    current_user = null
    current_email = null
    current_task = null
    current_status = null
    task = {
        task_name: null,
        task_description: null,
        task_date: null,
        task_time: null
    }
    hide_all_children(main_window)
    hide_all_children(sign_out_block)
    show_all_children(header_buttons)
    hide_all_children(user_info)
    show_all_children(main_text)
    hide_all_children(tasks_container)
    change_last_action(0)
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
        .then(data => update_task_table(data))
        .catch(error => {
            console.error('Error:', error)
        })
    show_all_children(tasks_container)
    hide_all_children(name_sort_arrow)
    hide_all_children(datetime_sort_arrow)
    hide_all_children(status_sort_arrow)
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
    hide_all_children(change_password_container)
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
    let date = form.querySelector('input[name="task_date"]').value

    if ((date === '') && (time !== '')) {
        const now = new Date()
        date = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
    }

    if (title.trim() === '') {
        display_error_message('Missing Task Title!', 'error-message-add')
    } else {

        const task_data = {
            task_name: title,
            task_description: description,
            task_time: time,
            task_date: date,
            task_status: '✘'
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
                check_deadlines()
                change_last_action(1)
                last_task_id = data.id
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
    save_task(current_task)
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
            change_last_action(3)
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

    last_task_id = current_task
    save_task(current_task)

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
                change_last_action(2)
            })
            .catch(error => {
                console.error("Error:", error)
            })
    }
}

document.getElementById('save-button').addEventListener('click', edit_task)

function delete_user() {
    fetch(`http://127.0.0.1:5000/api/${current_user}`, {
        method: 'DELETE',
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('User delete error')
            }
            return response.json()
        })
        .then(data => {
            sign_out()
        })
        .catch(error => {
            console.error('Error:', error)
        })
}

document.getElementById('delete-user-button').addEventListener('click', delete_user)

let is_changing_password = false

function changing_password() {
    document.getElementById('password-input').value = ''
    if (!is_changing_password) {
        is_changing_password = true
        show_all_children(change_password_container)
    } else {
        is_changing_password = false
        hide_all_children(change_password_container)
    }
}

document.getElementById('change-password-button').addEventListener('click', changing_password)

function change_password() {
    const new_password = document.getElementById('password-input').value
    if (new_password.trim() === '') {
        display_error_message('!', 'error-message-add')
        return
    }
    const user_data = {
        new_username: current_user,
        new_email: current_email,
        new_password: new_password
    }
    fetch(`http://127.0.0.1:5000/api/${current_user}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user_data)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Changing password error')
            }
            return response.json()
        })
        .then(data => {
            is_changing_password = false
            hide_all_children(change_password_container)
            get_user_info()
        })
        .catch(error => {
            console.error('Error:', error)
        })
}

document.getElementById('change-password-submit').addEventListener('click', change_password)

let name_sort = 0
let date_sort = 0
let status_sort = 0

function change_name_sort_status() {
    if (name_sort === 0) {
        name_sort = 1
        name_sort_arrow.querySelector('img').src = 'sources/arrow_down.png'
        hide_all_children(datetime_sort_arrow)
        hide_all_children(status_sort_arrow)
        show_all_children(name_sort_arrow)
    } else if (name_sort === 1) {
        name_sort = 2
        hide_all_children(datetime_sort_arrow)
        hide_all_children(status_sort_arrow)
        name_sort_arrow.querySelector('img').src = 'sources/arrow_up.png'
    } else {
        name_sort = 0
        hide_all_children(name_sort_arrow)
        name_sort_arrow.querySelector('img').src = 'sources/arrow_down.png'
    }
}

function change_date_sort_status() {
    if (date_sort === 0) {
        date_sort = 1
        datetime_sort_arrow.querySelector('img').src = 'sources/arrow_down.png'
        hide_all_children(name_sort_arrow)
        hide_all_children(status_sort_arrow)
        show_all_children(datetime_sort_arrow)
    } else if (date_sort === 1) {
        date_sort = 2
        hide_all_children(name_sort_arrow)
        hide_all_children(status_sort_arrow)
        datetime_sort_arrow.querySelector('img').src = 'sources/arrow_up.png'
    } else {
        date_sort = 0
        hide_all_children(datetime_sort_arrow)
        datetime_sort_arrow.querySelector('img').src = 'sources/arrow_down.png'
    }
}

function change_status_sort_status() {
    if (status_sort === 0) {
        status_sort = 1
        status_sort_arrow.querySelector('img').src = 'sources/arrow_down.png'
        hide_all_children(name_sort_arrow)
        hide_all_children(datetime_sort_arrow)
        show_all_children(status_sort_arrow)
    } else if (status_sort === 1) {
        status_sort = 2
        hide_all_children(name_sort_arrow)
        hide_all_children(datetime_sort_arrow)
        status_sort_arrow.querySelector('img').src = 'sources/arrow_up.png'
    } else {
        status_sort = 0
        hide_all_children(status_sort_arrow)
        status_sort_arrow.querySelector('img').src = 'sources/arrow_down.png'
    }
}

function is_no_sort() {
    return (name_sort === 0) && (date_sort === 0) && (status_sort === 0)
}

function update_task_table(data) {
    is_big_desc = true
    show_task_description()
    const task_body = document.getElementById('tasks-body')
    task_body.innerHTML = ''
    data.forEach(task => {
        const row = document.createElement('div')
        row.classList.add('tasks-row')
        row.onclick = () => get_task_info(task.id)
        row.id = task.id
        row.innerHTML = `
                         <div><p>${task.name}</p></div>
                         <div><p>${task.description}</p></div>
                         <div><p>${task.date}</p></div>
                         <div><p>${task.time}</p></div>
                         <div><p>${task.status}</p></div>`
        task_body.appendChild(row)
    })
    check_deadlines()
}

function sort_by_name() {
    change_name_sort_status()
    date_sort = 0
    status_sort = 0
    if (is_no_sort()) {
        get_user_tasks()
        return
    } else {
        fetch(`http://127.0.0.1:5000/api/${current_user}/tasks/sort/name/${name_sort}`, {
            method: 'GET'
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Name sort error')
                }
                return response.json()
            })
            .then(data => update_task_table(data))
            .catch(error => {
                console.log('Error:', error)
            })
    }
}

function sort_by_date() {
    change_date_sort_status()
    name_sort = 0
    status_sort = 0
    if (is_no_sort()) {
        get_user_tasks()
        return
    } else {
        fetch(`http://127.0.0.1:5000/api/${current_user}/tasks/sort/date/${date_sort}`, {
            method: 'GET'
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('DateTime sort error')
                }
                return response.json()
            })
            .then(data => update_task_table(data))
            .catch(error => {
                console.log('Error:', error)
            })
    }
}

function sort_by_status() {
    change_status_sort_status()
    date_sort = 0
    name_sort = 0
    if (is_no_sort()) {
        get_user_tasks()
        return
    } else {
        fetch(`http://127.0.0.1:5000/api/${current_user}/tasks/sort/status/${status_sort}`, {
            method: 'GET'
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Status sort error')
                }
                return response.json()
            })
            .then(data => update_task_table(data))
            .catch(error => {
                console.log('Error:', error)
            })
    }
}

document.getElementById('name-sort').addEventListener('click', sort_by_name)
document.getElementById('date-sort').addEventListener('click', sort_by_date)
document.getElementById('time-sort').addEventListener('click', sort_by_date)
document.getElementById('status-sort').addEventListener('click', sort_by_status)

function download_csv() {
    fetch(`http://127.0.0.1:5000/api/${current_user}/tasks/download`, {
        method: 'GET'
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Downloading file error')
            }
            return response.blob()
        })
        .then(blob => {
            const url = window.URL.createObjectURL(blob)

            const link = document.createElement('a')
            link.href = url
            link.download = `${current_user}_tasks.csv`
            link.click()

            URL.revokeObjectURL(url)
        })
        .catch(error => {
            console.error('Error:', error)
        })
}

document.getElementById('export-button').addEventListener('click', download_csv)

function check_task_deadline(task_id) {
    if (current_user == null) {
        return
    }
    fetch(`http://127.0.0.1:5000/api/${current_user}/tasks/${task_id}`, {
        method: 'GET'
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Checking deadline error')
            }
            return response.json()
        })
        .then(task => {
            if ((task.date === '') && (task.time === '')) {
                return
            } else if ((task.time === '') && (task.date !== '')) {
                task.time = '23:59'
            }
            const task_datetime = new Date(`${task.date}T${task.time}`)
            const current_datetime = new Date()
            if (current_datetime > task_datetime) {
                fetch(`http://127.0.0.1:5000/api/${current_user}/tasks/${task.id}/status`, {
                    method: 'GET'
                })
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Get task status error')
                        }
                        return response.json()
                    })
                    .then(data => {
                        if (!data.result) {
                            document.getElementById(task.id).querySelectorAll('p').forEach(text => {
                                text.style.color = '#f25252'
                            })
                        }
                    })
            }
        })
        .catch(error => {
            console.error(error)
        })
}

function check_deadlines() {
    if (current_user == null) {
        return
    }
    fetch(`http://127.0.0.1:5000/api/${current_user}/tasks`, {
        method: 'GET'
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Checking deadlines error')
            }
            return response.json()
        })
        .then(data => {
            data.forEach(task => {
                check_task_deadline(task.id)
            })
        })
        .catch(error => {
            console.error('Error:', error)
        })
}

const now = new Date()
const delay  = (60 - now.getSeconds()) * 1000 + 1000
setTimeout(() => {
    check_deadlines()
    setInterval(check_deadlines, 60000)
}, delay)

function save_task(id) {
    if (id === null) {
        return
    }
    fetch(`http://127.0.0.1:5000/api/${current_user}/tasks/${id}`, {
        method: 'GET'
    })
        .then(response => {
        if (!response.ok) {
            throw new Error('Save task error')
        }
        return response.json()
    })
        .then(data => {
            last_task = {
                task_name: data.name,
                task_description: data.description,
                task_date: data.date,
                task_time: data.time,
                task_status: data.status
            }
        })
        .catch(error => {
            console.error('Error:', error)
        })
}

/*
    0 - nothing
    1 - add
    2 - edit
    3 - delete
 */
let last_action = 0
let last_task_id = null
let last_task = {
    task_name: null,
    task_description: null,
    task_date: null,
    task_time: null,
    task_status: null
}

function change_last_action(key) {
    last_action = key
    if (last_action === 0) {
        undo_button.classList.remove('undo-active')
        undo_button.classList.add('undo-inactive')
        last_task_id = null
        last_task = {
            name: null,
            description: null,
            date: null,
            time: null,
            status: null
    }
    } else {
        undo_button.classList.remove('undo-inactive')
        undo_button.classList.add('undo-active')
    }
}

function undo_add() {
    if (last_task_id === null) {
        return
    }
    fetch(`http://127.0.0.1:5000/api/${current_user}/tasks/${last_task_id}`, {
        method: 'DELETE'
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Undo adding error')
            }
            return response.json()
        })
        .then(data => {
            if (last_task_id === current_task) {
                hide_all_children(task_info)
            }
            current_task = null
            get_user_tasks()
            change_last_action(0)
        })
        .catch(error => {
            console.error('Error:', error)
        })
}

function undo_edit(event) {
    fetch(`http://127.0.0.1:5000/api/${current_user}/tasks/${last_task_id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(last_task)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Undo editing error')
            }
            return response.json()
        })
        .then(data => {
            if ((current_task === last_task_id) && (current_task !== null)) {
                const temp = current_task
                current_task = null
                get_task_info(last_task_id)
            }
            back_to_task_list(event)
            change_last_action(0)
        })
        .catch(error => {
            console.error('Error:', error)
        })
}

function undo_delete() {
    fetch(`http://127.0.0.1:5000/api/${current_user}/tasks`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(last_task)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Undo deleting error')
            }
            return response.json()
        })
        .then(data => {
            get_user_tasks()
            check_deadlines()
            get_user_tasks()
            change_last_action(0)
        })
        .catch(error => {
            console.error('Error:', error)
        })
}

function undo_action(event) {
    if (last_action === 0) {
        return
    } else if (last_action === 1) {
        undo_add()
    } else if (last_action === 2) {
        undo_edit(event)
    } else if (last_action === 3) {
        undo_delete()
    }
}

undo_button.addEventListener('click', undo_action)