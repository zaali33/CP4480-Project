let users = []

loadUsers = () => {
    users = [
        {username: 'zainab', password: 'zainab123', type: 'user'},
        {username: 'hanan', password: 'hanan123', type: 'user'},
        {username: 'aisha', password: 'aisha123', type: 'user'},
        {username: 'admin', password: 'admin123', type: 'admin'},
        {username: 'sarah', password: 'sarah123', type: 'user'}
    ]
}

logMessage = (m) => 
    console.log(`${m} ${new Date()}`)

loadUsers()

authenticateUser = (username, password) => 
    users.find(u => u.username === username && u.password === password)

let express = require('express')
let app = express()
app.use(express.json())

let jwt = require('jsonwebtoken')
let cookieParser = require('cookie-parser')
app.use(cookieParser())

let appSecret = 'plmcbdgosihesirbadnapdojauryrgsbjaknpas852972164lokodnshgkhonfshdbks'

app.get('/api/start', (req, res) => {
    res.send('Messages Application started at ' + new Date())
    logMessage('Messages Application started at')
})

app.post('/api/login', (req, res) => {
    let username = req.body.username
    let password = req.body.password
    let authenticatedUser = authenticateUser(username, password)
    if(authenticatedUser) {
        let user = {
            username: username,
        }
        let token = jwt.sign(user, appSecret, {expiresIn: 1000})
        res.cookie('user-token', token, {httpOnly: true})
        res.send('ok')
        res.status(200)
        return
    }
    res.status(401)
    res.send("not authorized")
})

app.listen(3005, ()  => {
    logMessage("The messages application is running")
})