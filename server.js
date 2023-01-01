const express = require('express');
const http = require('http');
const app = express();
const server = http.createServer(app);

const {Server} = require('socket.io');
const io = new Server(server);

const bodyParser = require('body-parser');

const mongoose = require('mongoose');
const AccountModel = require('./SchemaMongoose/Account');

io.on('connection', (socket)=>{
    socket.on("sendMessage",(data)=>{
        io.emit("recieveMessage",data);
    })
})

app.use(express.static('public'));

// body-parser
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
/////////////////////

const checkValidUser = (req, res, next)=>{
    var username = req.body.username;
    var password = req.body.password;
    AccountModel.find({
        username,
        password 
    }).then(data=>{
        if(data.length != 0)next();
        else {
            res.json({
                url:"/login"
            }); 
        }
    }).catch(err=>{
        throw err;
    })
}

app.post('/login/v1',checkValidUser,(req, res)=>{
    res.json({
        token:Math.random(),
        url:"/"
    });
})

app.get('/login',(req, res)=>{
    res.sendFile(__dirname + '/public/login.html');
})

app.get('/',(req, res)=>{ 
    res.sendFile(__dirname + "/public/home.html");
})

server.listen(3000)