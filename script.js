hide_all_children(document.getElementById('login-form-container'))
hide_all_children(document.getElementById('registration-form-container'))


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
    show_all_children(document.getElementById('main-text'))
}

function to_login_form() {
    hide_all_children(document.getElementById('main-text'))
    show_all_children(document.getElementById('login-form-container'))
}

function from_login_form() {
    hide_all_children(document.getElementById('login-form-container'))
}

function to_registration_form() {
    hide_all_children(document.getElementById('main-text'))
    show_all_children(document.getElementById('registration-form-container'))
}

function from_registration_form() {
    hide_all_children(document.getElementById('registration-form-container'))
}