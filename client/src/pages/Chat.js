import React from 'react';
import { ChannelList } from '../components/ChannelList';
import '../styles/chat.css';
import { MessagesPanel } from '../components/MessagesPanel';
import socket from '../utils/socket'
import axios from 'axios'

export default class Chat extends React.Component {

    state = {
        channels: [],
        socket: null,
        channel: null,
        users: [],
        user: null,
        receiverType: "",
        filteredUsers: null,
        clients: []
    }
    componentDidMount = async () => {
        
        await this.loadChannels();
        await this.loadUsers()
        socket.connect()
        this.configureSocket();
        
    }

    configureSocket = () => {

        socket.emit("addMe", { username: this.props.username })
        socket.on('connection', () => {
            if (this.state.channel) {
                this.handleChannelSelect(this.state.channel.id);
            }
        });
        socket.on('update_channel_status', data => {
            if (data.type === "PUBLIC") {
                let channels = this.state.channels;
                channels.forEach(c => {
                    if (c.id === data.id) {
                        c.members = data.members;
                    }
                });
                this.setState({ channels });
            }
            else if (data.type === "PRIVATE") {

                let users = this.state.users;
                console.log(users)
                users.forEach(u => {
                    if (u.username === data.username) {
                        u.status = data.userStatus;
                    }
                });
                this.setState({ users, filteredUsers: users });

            }
        });

        socket.on('load_pub_channel', channel => {

            let channels = this.state.channels;
            channels.forEach(c => {
                if (c.id === channel.id) {
                    // c.members = channel.members;
                    c.messages = channel.messages
                }
            });
            this.setState({ channels });
        });
        socket.on('load_pr_channel', data => {
            let users = this.state.users;
            users.forEach(c => {
                if (c.id === data.id) {
                    c.messages = data.messages
                }
            });
            this.setState({ users });
        });


        socket.on('receive_pub_message', message => {

            let channels = this.state.channels
            channels.forEach(c => {
                if (c.id == message.to) {
                    if (!c.messages) {
                        c.messages = [message];
                    } else {
                        let flag=false;
                        c.messages.forEach(m=>{
                            if(m._id==message.id){
                                flag = true;
                            }
                        })
                        if(!flag)      
                            c.messages.push(message) ;
                        flag=true
                    }
                } 
            });
            this.setState({ channels });

        });
        socket.on('receive_pr_message', message => {

            let users = this.state.users
            users.forEach(u => {
                if (u.username == message.to) {
                    if (!u.messages) {
                        u.messages = [message];
                    } else {
                        let flag=false;
                        u.messages.forEach(m=>{
                            if(m._id==message.id){
                                flag = true;
                            }
                        })
                        if(!flag)
                            u.messages.push(message);
                        flag=true;
                    }
                }
            });

            this.setState({ users });
        });

    }

    loadChannels = async () => {
        await axios.get('http://localhost:5000/api/channel/getAll').then(res => {
            this.setState({ channels: res.data.channels });
        })
    }

    loadUsers = async () => {
        await axios.get('http://localhost:5000/api/user/getAll')
            .then(res => {
                this.setState({ users: res.data.users })
            })
        await axios.get('http://localhost:5000/api/channel/getClients')
            .then(res => {
                this.setState({ clients: res.data.clients })
        })

        let clients = this.state.clients;
        let users = this.state.users;

        users.forEach(u => {
            if (clients.includes(u.username)) {
                u.status = "ONLINE"
            }
        })
        this.setState({ users, filteredUsers: users })
        console.log(clients)

    }

    handleChannelSelect = data => {
        if (data.receiverType === "PUBLIC") {

            let channel = this.state.channels.find(c => {
                return c.id === data.channelId;
            });
            this.setState({ channel, receiverType: data.receiverType, user:null });

            socket.emit('channel-join', { ...data });
        } 
        else if (data.receiverType === "PRIVATE") {

            let user = this.state.users.find(u => {
                return u._id === data.channelId;
            });
            this.setState({ user, receiverType: data.receiverType, channel:null });

            socket.emit('channel-join', {
                to: user.username,
                from: this.props.username,
                receiverType: data.receiverType
            });
        }



    }

    handleSendMessage = (text) => {

        socket.emit('send', {
            from: this.props.username,
            to: this.state.receiverType === "PUBLIC" ? this.state.channel.id : this.state.user.username,
            content: text,
            receiverType: this.state.receiverType
        })
    }
    filter = (name) => {
        if (name === "")
            this.setState({
                filteredUsers: this.state.users
            })
        else
            this.setState({
                filteredUsers: this.state.users.filter(u => u.username.toLowerCase().includes(name.toLowerCase()))
            })
    }

    render() {
        return (
            <div className='chat-app'>
                <ChannelList channels={this.state.channels}
                    users={!this.state.filteredUsers ? this.state.users : this.state.filteredUsers}
                    onSelectChannel={this.handleChannelSelect} filterUsers={this.filter}
                    setUsername={this.props.setUsername}
                    username={this.props.username}  />
                <MessagesPanel onSendMessage={this.handleSendMessage}
                    channel={this.state.receiverType === "PUBLIC" ? this.state.channel : this.state.user}
                    receiverType={this.state.receiverType}
                    username={this.props.username} 
                    current={ this.state.user !== null ? this.state.user.username : this.state.channel !== null? this.state.channel.name :""}/>
            </div>
        );
    }
}

