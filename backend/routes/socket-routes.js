const { UserSocket } = require("../controllers/user-controller")

let prefix = []

const socketRoutes = (req) => {
    prefix = req.split('_')
    let response = null

    switch (prefix[0]) {
        case 'user':
            response = userAgent(prefix[1])
            break;
    
        default:
            break;
    }

    return response   
}

/**
 * 
 * @param {String} suffix 
 * @returns 
 */
const userAgent = (suffix) => {
    let response = null
    switch (suffix) {
        case 'get':
            response = UserSocket.getUser()
            break;
        case 'add':
            response = UserSocket.addUser(prefix)
            break;
        case 'edit':
            response = UserSocket.editUser(prefix)
            break;
        case 'delete':
            response = UserSocket.deleteUser(prefix)
            break;
        default:
            break;
    }

    return response
}

module.exports = socketRoutes