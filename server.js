let mysql = require('mysql')

const { MessageManager } = require("./webfiles/message.js")
const { UserManager } = require("./webfiles/user.js")

const bcrypt = require('bcrypt');
const saltRounds = 1;

let messageManager = new MessageManager()
let userManager = new UserManager()

connection = async (params) => new Promise(
    (resolve, reject) => {
        const connection = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'password',
            database: 'message'
        });
        connection.connect(error => {
            if (error) {
                reject(error);
                return;
            }
            resolve(connection);
        })
    }
);

query = async (conn, q, params) => new Promise(
    (resolve, reject) => {
        const handler = (error, result) => {
            if (error) {
                reject(error);
                return;
            }
            resolve(result);
        }
        conn.query(q, params, handler);
    }
);

logMessage = (m) =>
    console.log(`${m} ${new Date()}`)

let allUsers = []
loadAllUsers = async () => {
    allUsers = await userManager.loadAllUsers()
}

const authenticateUser = async (username, password) => {
    let c = false
    await loadAllUsers()
    let searchedUser = allUsers.find(u => u.username === username)
    if (searchedUser) {
        c = await bcrypt.compare(password, searchedUser.password)
        return c 
    } else {
        return c
    }
}

let express = require('express')
let app = express()
app.use(express.json())
app.use(express.static('webfiles')) //will be commented

let jwt = require('jsonwebtoken')
let cookieParser = require('cookie-parser')
app.use(cookieParser())

let appSecret = 'plmcbdgosihesirbadnapdojauryrgsbjaknpas852972164lokodnshgkhonfshdbks'

app.get('/api/start', (req, res) => {
    res.send('Messages Application started at ' + new Date())
    logMessage('Messages Application started at')
})

app.post('/api/login', async (req, res) => {
    let username = req.body.username
    let password = req.body.password
    let authenticated = await authenticateUser(username, password)
    if (authenticated) {
        let user = {
            username: username,
        }
        let token = jwt.sign(user, appSecret, { expiresIn: 20000 })
        res.cookie('user-token', token, { httpOnly: true })
        res.send('ok')
        res.status(200)
        return
    }
    res.status(401)
    res.send("not authorized")
})

app.post('/api/viewUserMessage', async (req, res) => {
    let receiverid = req.body.username
    try {
        let token = req.cookies['user-token']
        let user = jwt.verify(token, appSecret)
        try {
            let messages = await messageManager.getSenderReceiverMessages(user.username, receiverid)
            res.send(messages)
        }
        catch (e) {
            res.status(500)
            res.send(e)
        }
    }
    catch (e) {
        res.status(401)
        res.send("Unauthorized")
    }
})

app.post('/api/sendMessage', async (req, res) => {
    let receiverid = req.body.receiver
    let message = req.body.message
    try {
        let token = req.cookies['user-token']
        let senderid = jwt.verify(token, appSecret)
        try {
            await messageManager.sendMessage({ message, receiverid, senderid: senderid.username })
            res.status(200)
            res.send("Message sent")
        }
        catch (e) {
            res.status(500)
            res.send(e)
        }
    }
    catch (e) {
        res.status(401)
        res.send("Unauthorized")
    }
})

app.get('/api/loadUsers', async (req, res) => {
    try {
        let token = req.cookies['user-token']
        let senderid = jwt.verify(token, appSecret)
        try {
            let users = await userManager.loadUsers(senderid.username)
            res.status(200)
            res.send(users)
        }
        catch (e) {
            res.status(500)
            res.send(e)
        }
    }
    catch (e) {
        res.status(401)
        res.send("Unauthorized")
    }
})

app.listen(3005, () => {
    logMessage("The messages application is running")
})