const Penyebab = require('../models/penyebab-model')

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

class PenyebabController {
    static getPenyebab = async () => {
        try {
            const data = await Penyebab.findAll()
            return response(50, 'success get penyebab', data)
        } catch (error) {
            return response(450, error.message, null)
        }
    }

    static addPenyebab = async (prefix) => {
        try {
            const payload = {
                penyebab: prefix[2],
                kategori: prefix[3],
                no_pvm: parseInt(prefix[4]),
                b_active: 't'
            }

            const data = await Penyebab.create(payload)
            if(data){
                const allPenyebab = await Penyebab.findAll()
                return response(51, 'success add penyebab', allPenyebab)
            }else{
                return response(551, 'fail add penyebab', null)
            }
        } catch (error) {
            return response(451, error.message, null)
        }
    }

    static editPenyebab = async (prefix) => {
        try {
            const payload = {
                penyebab: prefix[3],
                kategori: prefix[4],
                no_pvm: parseInt(prefix[5]),
                b_active: prefix[6]
            }

            const data = await Penyebab.update({no_penyebab: parseInt(prefix[2])}, payload)
            if(data){
                const allPenyebab = await Penyebab.findAll()
                return response(52, `success update penyebab, no_penyebab: ${prefix[2]}`, allPenyebab)
            }else{
                return response(552, `fail update penyebab, no_penyebab: ${prefix[2]}`, null)
            }
        } catch (error) {
            return response(452, error.message, null)
        }
    }

    static deletePenyebab = async (prefix) => {
        try {
            const data = await Penyebab.delete({no_penyebab: parseInt(prefix[2])})
            if(data){
                const allPenyebab = await Penyebab.findAll()
                return response(53, `success delete penyebab, no_penyebab: ${prefix[2]}`, allPenyebab)
            }else{
                return response(553, `fail delete penyebab, no_penyebab: ${prefix[2]}`, null)
            }
        } catch (error) {
            return response(453, error.message, null)
        }
    }
}


module.exports = {
    PenyebabController
}