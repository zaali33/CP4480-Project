let selectedUser = undefined
let selectedClassName = undefined

function viewUserMessages(className, username) {
    selectedClassName = className
    document.querySelectorAll('.single-user').forEach(e => e.classList.remove('selected'));
    className.classList.add('selected')
    selectedUser = username
    $.ajax({
        url: "/api/viewUserMessage",
        method: "POST",
        contentType: 'application/json',
        data: JSON.stringify({ username: username }),
        success: function (result) {
            let msgContainer = document.getElementsByClassName('messages-container')[0]
            msgContainer.innerHTML = ""
            result.forEach(msg => {
                if (msg.receiverid === username) {
                    msgContainer.innerHTML += `
                        <div class="send-msg-container">
                            <div class="send-msg">
                                ${msg.message}
                            </div>
                        </div>
                    `
                }
                else {
                    msgContainer.innerHTML += `
                        <div class="receive-msg-container">
                            <div class="receive-msg">
                                ${msg.message}
                            </div>
                        </div>
                    `
                }

            })
        },
        error: function (j, t, e) {
            window.location.href = "/messages.html"
        }
    })
}

function sendMessage() {
    if (selectedUser) {
        let message = document.getElementById('message-content').value
        $.ajax({
            url: "/api/sendMessage",
            method: "POST",
            contentType: 'application/json',
            data: JSON.stringify({ receiver: selectedUser, message: message }),
            success: function (result) {
                viewUserMessages(selectedClassName, selectedUser)
                document.getElementById('message-content').value = ""
            },
            error: function (j, t, e) {
                alert("Internal error occured")
                window.location.href = "/messages.html"
            }
        })
    }
}

function doLogin() {
    let us = $("#username").val()
    let pw = $("#password").val()

    loginRequest = {
        username: us,
        password: pw,
    }

    $.ajax({
        url: "/api/login",
        method: "post",
        contentType: "application/json",
        data: JSON.stringify(loginRequest),
        success: function (result) {
            window.location.href = "/messages.html"
        },
        error: function (j, t, e) {
            alert("Invalid credentials")
            window.location.href = "/"
        }
    })
}

function loadUsers() {
    let userContainer = document.getElementsByClassName('user-container')[0]
    userContainer.innerHTML = ""
    $.ajax({
        url: "/api/loadUsers",
        method: "get",
        contentType: "application/json",
        success: function (result) {
            result.forEach(user => {
                userContainer.innerHTML += `
                    <div class="single-user" onclick="viewUserMessages(this, '${user.username}')">
                        <div class="user-details">
                            ${user.username}
                        </div>
                    </div>
                `
            })
        },
        error: function (j, t, e) {
            alert("Invalid credentials")
            window.location.href = "/"
        }
    })
}

function loadAdminScreen() {
//     document.getElementById('admin-msg-container').innerHTML = ''
//     $.ajax({
//         url: "/api/loadAdminScreen",
//         method: "get",
//         contentType: "application/json",
//         success: function (result) {
//             if(result.length > 0) {
//                 document.getElementById('admin-msg-container').innerHTML += `

//                 `
//             }
//         },
//         error: function (j, t, e) {
//             console.log(j, t, e)
//         }
//     })
}

function start() {
    $.ajax({
        url: "/api/start",
        method: "get",
        success: function (result) {
            console.log(result)
        },
        error: function (x, t, s) {
            console.log("error")
        }
    })
}