import clientSocket from 'socket.io-client';

const URL = 'http://localhost:5000';

let socket = clientSocket(URL,{autoConnect: false});

export default socket;