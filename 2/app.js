const express = require('express')
const app = express()
const jwt = require('jsonwebtoken')
const data = require('./data.json')
const port = 3000

app.use(express.json())
app.use(express.urlencoded({extended: true}))

const login = {
    username: "raka",
    password: "123"
    }

app.post("/login", (req, res) => {
    const {username, password} = req.body

    if (username === null || password === null) {
        res.status(401).json({message: "username or password invalid"})
    } else if (username !== login.username || password !== login.password) {
        res.status(401).json({message: "username or password invalid"})
    } else {
        let token = jwt.sign({login: login}, 'rahasia')
        res.status(200).json({token: token})
    }
})

app.use(function (req, res, next) {
    jwt.verify(req.headers.token, 'rahasia', (err, decoded) => {
        if (err) {
            res.status(401).json({ message: "Error" })
        }
        console.log(decoded.login)
    })
    next()
})

app.get("/data", (req, res) => {
    res.send(data)
})

app.listen(port, () => {
    console.log('Listening on port: ', port)
})
