/**

* @jest-environment node

*/
const axios = require('axios')
const { test, expect } = require('@jest/globals')

test('Case 1: Login is successful', async () => {
    let res = await axios.post(
        'http://192.168.10.26:3005/api/login',
        {
            "username": 'admin',
            "password": 'admin123'
        }
    )
    expect(res.status).toBe(200)
    expect(res.data.msg).toBe("ok")
})

test('Case 2: Login is unsuccessful', async () => {
    let res = await axios.post(
        'http://192.168.10.26:3005/api/login',
        {
            "username": 'admin333',
            "password": 'admin123'
        }
    ).catch(function(error) {
        expect(error.response.status).toBe(401)
    })
})

test("Case 1: Valid token to load users", async () => {
    //get the valid token
    let loginRes = await axios.post(
        'http://192.168.10.26:3005/api/login',
        {
            "username": 'admin',
            "password": 'admin123'
        }
    )
    let token = loginRes.data.token
    let loadUsersRes = await axios.get(
        'http://192.168.10.26:3005/api/loadUsers',
        {
            headers: {
                "Cookie": `user-token=${token}`
            },
            withCredentials: true
        }
    )
    expect(loadUsersRes.status).toBe(200)
})

test("Case 2: Invalid token to load users", async () => {
    //get a valid token
    let loginRes = await axios.post(
        'http://192.168.10.26:3005/api/login',
        {
            "username": 'admin',
            "password": 'admin123'
        }
    )
    //make the token invalid
    let token = loginRes.data.token + "1234"
    let loadUsersRes = await axios.get(
        'http://192.168.10.26:3005/api/loadUsers',
        {
            headers: {
                "Cookie": `user-token=${token}`
            },
            withCredentials: true
        }
    ).catch(function(error) {
        expect(error.response.status).toBe(401)
    })
})

//Case 3: Internal Database Erorr (500) not sure about it yet...
//will ask from Sir Robert tomorrow so leave for now...where ever you see internall 500 error, leave it