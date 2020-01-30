const express= require('express')
const socketio= require('socket.io')
const http = require('http')
const path= require('path')
const {getMessage,getLocation} = require('./utils/message')
const {addUser, removeUser, getUser, getUsersInRoom} = require('./utils/users')
const publicDir= path.join(__dirname,'../public')
const port = process.env.PORT || 3000
const app = express()

app.use(express.static(publicDir))

const server= http.createServer(app)
const io= socketio(server)

let count=0
io.on('connection',(socket)=>{
    
    socket.on('join',({username,room})=>{
            const user=addUser({id:socket.id,name:username,room})
            socket.join(room)
            socket.broadcast.to(user.room).emit('message',getMessage('joined:',user.name))
            io.to(user.room).emit('activeUser',getUsersInRoom(user.room))
    })

    socket.on('message',(message,acknowledgeCB)=>{
       const user= getUser(socket.id)
        io.to(user.room).emit('message',getMessage(message,user.name))
        acknowledgeCB()
    })
    socket.on('locationMessage',(position,acknowledgeCB)=>{
        const user= getUser(socket.id)
        io.to(user.room).emit('locationMessage',getLocation(position,user.name))
        acknowledgeCB('Location Shared')
    })
    socket.on('disconnect',()=>{
        const user=removeUser(socket.id)
        io.to(user.room).emit('message',getMessage(`${user.name} left!`))
    })
})
server.listen(port,()=>{
    console.log(`Server start at${port}`)
})