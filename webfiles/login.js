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
        success: function(result) {
            window.location.href="/messages.html"
        },
        error: function(j, t, e) {
            alert("Invalid credentials")
        }
    })
}

function start() {
    $.ajax({
        url: "/api/start",
        method: "get",
        success: function(result) {
            console.log(result)
        },
        error: function(x, t, s) {
            console.log("error")
        }
    })
}

start()
