main_text = document.getElementById('main-text')
login_form = document.getElementById('login-form-container')
registration_form = document.getElementById('registration-form-container')
user_info = document.getElementById('user-info')
header_buttons = document.getElementById('header-buttons')
sign_out_block = document.getElementById('sign-out-container')

hide_all_children(login_form)
hide_all_children(registration_form)
hide_all_children(user_info)
hide_all_children(sign_out_block)

let current_user = null

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
    from_login_form()
    from_registration_form()
    show_all_children(main_text)
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
        display_error_message('Missing username!', 'error-username')
        is_username_valid = false
    }

    if (password.trim() === '') {
        display_error_message('Missing password!', 'error-password')
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
            get_user_info()
        })
        .catch(error => {
            console.error('Error:', error)
        })
    }
}

document.getElementById('login_button').addEventListener('click', login_submit)

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
    hide_all_children(sign_out_block)
    show_all_children(header_buttons)
    hide_all_children(user_info)
    show_all_children(main_text)
}