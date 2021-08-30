const app = require("express")();
const open = require('open');
const httpServer = require("http").createServer(app);
const cors = require('cors')
const bodyParser = require('body-parser');

const route = require("./routes");
const socketRoutes = require("./routes/socket-routes");

require('dotenv').config()

const io = require("socket.io")(httpServer, {
    cors: {
        origin: '*'
    }
});
const PORT = process.env.PORT || 1212


//#region MIDLEWARE
app.use(cors())
// parse application/json
app.use(bodyParser.json({limit : "100mb"}))
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({limit : "100mb", extended: false }))
//#endregion


//#region SOCKET EVENT
io.on("connection", async (socket) => {
    console.log(`a client connected, socket : ${socket.id} ${JSON.stringify(socket.handshake.query.id)}`)
    
    const id = socket.handshake.query.id
    /** Send message to a specific client **/
    // socket.join(id)
    
    socket.emit('first-login', socket.handshake)
    
    let count = 0
    socket.on('request', async (data) => {
        count++
        /** Broadcast message to all client **/
        // socket.broadcast.emit('response', `Ini response untuk client ${id}`)
        /** Send message to a specific client **/
        // socket.broadcast.to(clientId).emit('response', `Ini response untuk client ${id}`)
        
        console.log(`request from client ${id} :`, data, `, counting request : ${count}`)
        const response = await socketRoutes(data)

        socket.emit('response', response)
    })

    socket.on('disconnect', () => {
        count = 0
        console.log(`a client connected, socket : ${socket.id} ${JSON.stringify(socket.handshake.query.id)}`)
    })
});
//#endregion


//#region ENDPOINT
app.get('/', (req, res) => {
    res.json({
        code: 0,
        description: 'back-end service log apps monitoring 🚀🚀🚀',
        author: 'ichsankurnia 😎',
    })
})
app.use('/api/', route)
//#endregion


httpServer.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`)
    /** opens the url in the default browser **/
    open(process.env.UI_URL);
    /** Open the url in the specific browser */
    // open(process.env.UI_URL, {app: 'firefox'});
})