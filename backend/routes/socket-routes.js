const { LokasiController } = require("../controllers/lokasi-controller")
const { PartController } = require("../controllers/part-controller")
const { PenyebabController } = require("../controllers/penyebab-controller")
const { PerangkatController } = require("../controllers/perangkat-controller")
const { ProjekController } = require("../controllers/projek-controller")
const { SolusiController } = require("../controllers/solusi-controller")
const { TroubleETController } = require("../controllers/troubleET-controller")
const { UserSocket } = require("../controllers/user-controller")


let prefix = []

const socketRoutes = (req) => {
    prefix = req.split('_')
    let response = null

    switch (prefix[0]) {
        case 'user':
            response = userAgent(prefix[1])
            break;
        case 'projek':
            response = projekAgent(prefix[1])
            break;
        case 'lokasi':
            response = lokasiAgent(prefix[1])
            break;
        case 'perangkat':
            response = perangkatAgent(prefix[1])
            break;
        case 'part':
            response = partAgent(prefix[1])
            break;
        case 'penyebab':
            response = penyebabAgent(prefix[1])
            break;
        case 'solusi':
            response = solusiAgent(prefix[1])
            break;
        case 'troubleET':
            response = troubleETAgent(prefix[1])
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


const projekAgent = (suffix) => {
    let response = null
    switch (suffix) {
        case 'get':
            response = ProjekController.getProyek()
            break;
        case 'add':
            response = ProjekController.addProjek(prefix)
            break;
        case 'edit':
            response = ProjekController.editProjek(prefix)
            break;
        case 'delete':
            response = ProjekController.deleteProjek(prefix)
            break;
        default:
            break;
    }

    return response
}


const lokasiAgent = (suffix) => {
    let response = null
    switch (suffix) {
        case 'get':
            response = LokasiController.getLokasi()
            break;
        case 'add':
            response = LokasiController.addLokasi(prefix)
            break;
        case 'edit':
            response = LokasiController.editLokasi(prefix)
            break;
        case 'delete':
            response = LokasiController.deleteLokasi(prefix)
            break;
        default:
            break;
    }

    return response
}


const perangkatAgent = (suffix) => {
    let response = null
    switch (suffix) {
        case 'get':
            response = PerangkatController.getPerangkat()
            break;
        case 'add':
            response = PerangkatController.addPerangkat(prefix)
            break;
        case 'edit':
            response = PerangkatController.editPerangkat(prefix)
            break;
        case 'delete':
            response = PerangkatController.deletePerangkat(prefix)
            break;
        default:
            break;
    }

    return response
}


const partAgent = (suffix) => {
    let response = null
    switch (suffix) {
        case 'get':
            response = PartController.getPart()
            break;
        case 'add':
            response = PartController.addPart(prefix)
            break;
        case 'edit':
            response = PartController.editPart(prefix)
            break;
        case 'delete':
            response = PartController.deletePart(prefix)
            break;
        default:
            break;
    }

    return response
}


const penyebabAgent = (suffix) => {
    let response = null
    switch (suffix) {
        case 'get':
            response = PenyebabController.getPenyebab()
            break;
        case 'add':
            response = PenyebabController.addPenyebab(prefix)
            break;
        case 'edit':
            response = PenyebabController.editPenyebab(prefix)
            break;
        case 'delete':
            response = PenyebabController.deletePenyebab(prefix)
            break;
        default:
            break;
    }

    return response
}


const solusiAgent = (suffix) => {
    let response = null
    switch (suffix) {
        case 'get':
            response = SolusiController.getSolusi()
            break;
        case 'add':
            response = SolusiController.addSolusi(prefix)
            break;
        case 'edit':
            response = SolusiController.editSolusi(prefix)
            break;
        case 'delete':
            response = SolusiController.deleteSolusi(prefix)
            break;
        default:
            break;
    }

    return response
}


const troubleETAgent = (suffix) => {
    let response = null
    switch (suffix) {
        case 'downtime':
            response = TroubleETController.getDownTime(prefix)
            break;
        case 'noticket':
            response = TroubleETController.getNoTicket(prefix)
            break;
        default:
            break;
    }

    return response
}


module.exports = socketRoutes