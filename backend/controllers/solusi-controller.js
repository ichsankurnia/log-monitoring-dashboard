const Solusi = require('../models/solusi-model')

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

class SolusiController {
    static getSolusi = async () => {
        try {
            const data = await Solusi.findAll()
            return response(60, 'success get solusi', data)
        } catch (error) {
            return response(460, error.message, null)
        }
    }

    static addSolusi = async (prefix) => {
        try {
            const payload = {
                nama_solusi: prefix[2],
                no_penyebab: parseInt(prefix[3]),
                b_active: 't'
            }
            
            const data = await Solusi.create(payload)
            if(data){
                const allSolusi = await Solusi.findAll()
                return response(61, 'success add new solusi', allSolusi)
            }else{
                return response(561, 'fail add new solusi', null)
            }
        } catch (error) {
            return response(461, error.message, null)
        }
    }

    static editSolusi = async (prefix) => {
        try {
            const payload = {
                nama_solusi: prefix[3],
                no_penyebab: parseInt(prefix[4]),
                b_active: prefix[5]
            }

            const data = await Solusi.update({id_solusi: parseInt(prefix[2])}, payload)
            if(data){
                const allSolusi = await Solusi.findAll()
                return response(62, `fail update solusi, id_solusi: ${prefix[2]}`, allSolusi)
            }else{
                return response(562, `fail update solusi, id_solusi: ${prefix[2]}`, null)
            }
        } catch (error) {
            return response(462, error.message, null)
        }
    }

    static deleteSolusi = async (prefix) => {
        try {
            const data = await Solusi.delete({id_solusi: parseInt(prefix[2])})
            if(data){
                const allSolusi = await Solusi.findAll()
                return response(63, `fail delete solusi, id_solusi: ${prefix[2]}`, allSolusi)
            }else{
                return response(563, `fail delete solusi, id_solusi: ${prefix[2]}`, null)
            }
        } catch (error) {
            return response(463, error.message, null)
        }
    }
}


module.exports = {
    SolusiController
}