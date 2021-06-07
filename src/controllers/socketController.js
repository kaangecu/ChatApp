const Message = require('../models/message');
const jwtHelper = require('../helpers/jwtHelper');

const CLIENTS = [];

const CHANNELS = [
    { name: "Gobal", id: 1, members: 0, sockets: [] },
    { name: "Javascript", id: 2, members: 0, sockets: [] },
    { name: "C-Sharp", id: 3, members: 0, sockets: [] },
    { name: "Python", id: 4, members: 0, sockets: [] }];

exports.getAll = async (req, res) => {

    res.json({
        channels: CHANNELS
    })
}

exports.getClients = async (req, res) => {
 
    res.json({
        clients: CLIENTS
    })
}

exports.addMe = (data, socket, io) => {
    CLIENTS[data.username] = socket.id
    io.emit('update_channel_status', { ...data, userStatus:"ONLINE" ,type:"PRIVATE"})
    io.emit('loadClients',CLIENTS)
    console.log(CLIENTS)
}

exports.send = (data, socket, io) => {

    if (data.content != undefined &&
        data.from != undefined &&
        data.to != undefined) {

        if (data.receiverType === "PUBLIC") {
            let message = new Message({ ...data,receiverType: "PUBLIC" });
            message.save().then(message => {
                io.emit('receive_pub_message', message);
            })
        }
        else if (data.receiverType === "PRIVATE") {
            let message = new Message({ ...data, receiverType: "PRIVATE" });
            message.save().then(msg => {
                //checking whether user online
                let receiverSocket = CLIENTS[data.to];
                let senderSocket = CLIENTS[data.from];

                if (receiverSocket !== undefined) {
                    io.to(receiverSocket).emit("receive_pr_message", msg);
                }
                io.to(senderSocket).emit("receive_pr_message", msg);

            })
        }
    }
}



exports.joinChannel = async (data, socket, io) => {
    let id = data.channelId;


    if (data.receiverType === "PUBLIC") {
        CHANNELS.forEach(async (c) => {
            if (c.id === id) {
                if (c.sockets.indexOf(socket.id) == (-1)) {
                    c.sockets.push(socket.id);
                    c.members++;
                    await Message.find({ receiverType: "PUBLIC", to: c.id }, (err, messages) => {
                        if (err)
                            console.log(err);

                        socket.emit('load_pub_channel', { ...c, messages });
                        io.emit('update_channel_status', {...c, type:"PUBLIC"})
                    })

                }
            } else {
                let index = c.sockets.indexOf(socket.id);
                if (index != (-1)) {
                    c.sockets.splice(index, 1);
                    c.members--;
                    io.emit('update_channel_status', {...c, type:"PUBLIC"})
                }
            }
        });
    }

    else {

        CHANNELS.forEach(async (c) => {
            let index = c.sockets.indexOf(socket.id);
            if (index != (-1)) {
                c.sockets.splice(index, 1);
                c.members--;
                io.emit('update_channel_status', {...c, type:"PUBLIC"})
            }

        });

        await Message.find({
            receiverType: "PRIVATE",
            $or: [{ to: data.to, from: data.from }, { to: data.from, from: data.to }]
        }, (err, messages) => {
            if (err)
                console.log(err);
            // console.log(messages)
            socket.emit('load_pr_channel', { ...data, messages });
        })
    }


    return id;
};

module.exports.disconnect = (data, socket, io) => {
    console.log("disconnecting")

    CHANNELS.forEach((c) => {
        let index = c.sockets.indexOf(socket.id);
        if (index != (-1)) {
            c.sockets.splice(index, 1);
            c.members--;
            io.emit('update_channel_status', {...c, type:"PUBLIC"})
        }

    });
    // let index = CLIENTS.keys(c=>console.log(c))
    // console.log(index)
    for(let client in CLIENTS){
        if(CLIENTS[client] === socket.id){
            console.log(CLIENTS[client] + " : "+ socket.id)
            delete CLIENTS[client];
            io.emit('update_channel_status', { username: client, userStatus:"OFFLINE" ,type:"PRIVATE"})
        }
    }
}