const express = require('express');
const mongoose = require("mongoose");
const config = require("./src/config/default.json");
const userRoute = require("./src/routes/api/userRoute");
const channelRoute = require("./src/routes/socket/chatSocket").router;

var cors = require('cors')


const app = express();
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(cors());
//bodyparser middlware
app.use(express.json());
app.use("/api/user", userRoute);
app.use("/api/channel", channelRoute);

//db config
const db = config.mongoURI;

// connect to db
mongoose.connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log("MongoDb Connected..."))
    .catch(err => console.log(err));



var httpServer = require('http').createServer(app);
var io = require('socket.io')(httpServer);
// app.get('*',(req,res) => {
//     res.sendFile(path.resolve(__dirname,"client","build","index.html"));
// });
const port = process.env.PORT || 5000;


httpServer.listen(port, () => console.log(`Server started on ${port}`));

require('./src/routes/socket/chatSocket').chatSocket(io);

