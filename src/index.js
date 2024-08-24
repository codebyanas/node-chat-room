const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const Filter = require('bad-words')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 3000
const publicDirectory = path.join(__dirname, '../public')

app.use(express.static(publicDirectory))

io.on('connection', (socket) => {
    console.log('New Websocket connection')

    socket.emit('message', 'Welcome!')
    socket.broadcast.emit('message', 'A new user joined!')

    socket.on('sendMessage', (message, callback) => {
        const filter = new Filter()

        if (filter.isProfane(message)) {
            return callback('Profanity is not allowed!')
        }

        io.emit('message', message)
        callback('Delivered!')
    })

    socket.on('disconnect', () => {
        io.emit('message', 'A new user left!')
    })

    socket.on('sendLocation', (coords) => {
        io.emit('message', `https://google.com/maps?q=${coords.latitude},${coords.longitude}`)
        
        console.log('Location shared!')
    })
})

server.listen(port, () => {
    console.log(`Server is running on ${port}`)
})



