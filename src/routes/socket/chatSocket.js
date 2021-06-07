const socketController = require('../../controllers/socketController');


const chatSocket = (io) => {
    io.on('connection', (socket) => {
        

        socket.on('send', (data) => socketController.send(data,socket,io))
        socket.on('addMe', (data)=>socketController.addMe(data,socket,io))
        socket.on('channel-join', (data) => socketController.joinChannel(data,socket,io))
        socket.on('disconnect', (data) => socketController.disconnect(data,socket,io))
    }); 
    
}

// module.exports = chatSocket;

const express = require("express");
const jwtHelper = require('../../helpers/jwtHelper');
const router = express.Router();

router.get("/getAll", socketController.getAll);
router.get("/getClients", socketController.getClients);

module.exports = {router,chatSocket};