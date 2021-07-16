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
    static getTrouble = async (req, res) => {
        try {
            const data = await TroubleET.findAll()
            return res.json(response(70, 'success get all trouble et', data))
        } catch (error) {
            return res.json(response(470, error.message, null))
        }
    }

    static getDetailTrouble = async (req, res) => {
        try {
            const {ticket_id} = req.params
            
            const data = await TroubleET.findOne({no: ticket_id})
            if(data){
                return res.json(response(71, 'success get trouble et', data))
            }else{
                return res.json(response(571, `fail get trouble et, no : ${ticket_id}`, null))
            }
        } catch (error) {
            return res.json(response(471, error.message, null))
        }
    }

    static addTrouble = async (req, res) => {
        try {
            const data = await TroubleET.create(req.body)
            if(data){
                return res.json(response(72, 'fail add new trouble et', data))
            }else{
                return res.json(response(572, 'fail add new trouble et', null))
            }
        } catch (error) {
            return res.json(response(472, error.message, null))
        }
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