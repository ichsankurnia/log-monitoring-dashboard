const app = require("express")();
const httpServer = require("http").createServer(app);
const cors = require('cors')
const bodyParser = require('body-parser');
const { getUser, getTroubleET, insetTroubleET } = require("./db");
const route = require("./routes");
require('dotenv').config()

const io = require("socket.io")(httpServer, {
    cors: {
        origin: '*'
    }
});
const PORT = process.env.PORT || 1212

//#region SOCKET EVENT
io.on("connection", (socket) => {
    // ...
});
//#endregion


//#region MIDLEWARE
app.use(cors())
// parse application/json
app.use(bodyParser.json({limit : "100mb"}))
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({limit : "100mb", extended: false }))
//#endregion


//#region ENDPOINT
app.get('/', (req, res) => {
    res.json({
        code: 0,
        description: 'back-end service log apps monitoring 🚀🚀🚀',
        author: 'ichsankurnia 😎',
    })
})

app.get('/user', getUser)
app.get('/et', getTroubleET)
app.post('/trouble-et', insetTroubleET)
app.use('/api/', route)
//#endregion


httpServer.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`)
})