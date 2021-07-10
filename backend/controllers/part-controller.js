const Part = require('../models/part-model')

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

class PartController {
    static getPart = async () => {
        try {
            const data = await Part.findAll()
            return response(40, 'success get part', data)
        } catch (error) {
            return response(440, error.message, null)
        }
    }

    static addPart = async (prefix) => {
        try {
            const payload = {
                nama_perangkat: prefix[2],
                jenis: prefix[3],
                b_active: 't'
            }
            
            const data = await Part.create(payload)
            if(data){
                const allPart = await Part.findAll()
                return response(41, 'success add new part', allPart)
            }else{
                return response(541, 'fail add new part', null)
            }
        } catch (error) {
            return response(441, error.message, null)
        }
    }

    static editPart = async (prefix) => {
        try {
            const payload = {
                nama_perangkat: prefix[3],
                jenis: prefix[4],
                b_active: prefix[5]
            }
            const data = await Part.update({no_pvm: parseInt(prefix[2])}, payload)
            if(data){
                const allPart = await Part.findAll()
                return response(42, `success upate part, no_pvm: ${prefix[2]}`, allPart)
            }else{
                return response(542, `fail update part, no_pvm: ${prefix[2]}`, null)
            }
        } catch (error) {
            return response(442, error.message, null)
        }
    }

    static deletePart = async (prefix) => {
        try {
            const data = await Part.delete({no_pvm: parseInt(prefix[2])})
            if(data){
                const allPart = await Part.findAll()
                return response(43, `success delete part, no_pvm: ${prefix[2]}`, allPart)
            }else{
                return response(543, `fail delete part, no_pvm: ${prefix[2]}`, null)
            }
        } catch (error) {
            return response(443, error.message, null)
        }
    }
}

module.exports = {
    PartController
}