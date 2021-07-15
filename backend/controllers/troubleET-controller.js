const TroubleET = require("../models/troubleET-model")

/**
 * 
 * @param {Number} statusCode 
 * @param {String} messageDesc 
 * @param {Object} data 
 * @returns 
 */
 const response = (statusCode, messageDesc, data) => {
    return {
        code: statusCode,
        message: messageDesc,
        data
    }
}

class TroubleETController {
    static addTrouble = async () => {

    }


    static getNoTicket = async (prefix) => {
        try {
            const data = await TroubleET.noTicket(prefix[2])
            if(data){
                return response(77, 'success get no ticket', data)
            }else{
                return response(577, 'fail get no ticket', null)
            }
        } catch (error) {
            return response(477, error.message, null)
        }
    }

    static getDownTime = async (prefix) => {
        try {
            const data = await TroubleET.downTime(prefix[2], prefix[3])
            if(data){
                return response(78, 'success get downtime', data)
            }else{
                return response(578, 'fail get downtime', null)
            }
        } catch (error) {
            return response(478, error.message, null)
        }
    }
}


module.exports = { TroubleETController }