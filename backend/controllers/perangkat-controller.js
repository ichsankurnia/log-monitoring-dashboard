const Perangkat = require("../models/perangkat-model")

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

class PerangkatController {
    static getPerangkat = async () => {
        try {
            const data = await Perangkat.findAll()
            return response(30, 'success get perangkat', data)
        } catch (error) {
            return response(430, error.message, null)
        }
    }

    static addPerangkat = async (prefix) => {
        try {
            const payload = {
                nama_perangkat: prefix[2],
                id: prefix[3],
                type: prefix[4],
                ip: parseInt(prefix[5]),
                b_active: 't'
            }

            const addData = await Perangkat.create(payload)
            if(addData){
                const allPerangkat = await Perangkat.findAll()
                return response(31, 'success add new perangkat', allPerangkat)
            }else{
                return response(531, 'fail add new perangkat', null)
            }
        } catch (error) {
            return response(431, error.message, null)
        }
    }

    static editPerangkat = async (prefix) => {
        try {
            const payload = {
                nama_perangkat: prefix[3],
                id: prefix[4],
                type: prefix[5],
                ip: parseInt(prefix[6]),
                b_active: prefix[7]
            }
            
            const editData = await Perangkat.update({no_perangkat: parseInt(prefix[2])}, payload)
            if(editData){
                const allPerangkat = await Perangkat.findAll()
                return response(32, `success update perangkat, no_perangkat : ${prefix[2]}`, allPerangkat)
            }else{
                return response(532, `fail update perangkat, no_perangkat : ${prefix[2]}`, null)
            }
        } catch (error) {
            return response(432, error.message, null)   
        }
    }

    static deletePerangkat = async (prefix) => {
        try {
            const deleteData = await Perangkat.delete({no_perangkat: parseInt(prefix[2])})
            if(deleteData){
                const allPerangkat = await Perangkat.findAll()
                return response(33, `success delete perangkat, no_perangkat : ${prefix[2]}`, allPerangkat)
            }else{
                return response(533, `fail delete perangkat, no_perangkat : ${prefix[2]}`, null)
            }
        } catch (error) {
            return response(433, error.message, null)
        }
    }
}

module.exports = {
    PerangkatController
}