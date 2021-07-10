const Projek = require("../models/projek-model")

const newLocal = (statusCode, messageDesc, data) => {
    return {
        code: statusCode,
        message: messageDesc,
        data
    }
}
/**
 * 
 * @param {Number} statusCode 
 * @param {String} messageDesc 
 * @param {Object} data 
 * @returns 
 */
 const response = newLocal


class ProjekController {
    static getProyek = async () => {
        try {
            const data = await Projek.findAll()
            return response(10, 'success get all model', data)
        } catch (error) {
            return response(410, error.message, null)
        }
    }

    static addProjek = async (prefix) => {
        try {
            const payload = {
                nama_projek: prefix[2],
                initial: prefix[3],
                b_active: 't'
            }

            const data = await Projek.create(payload)
            if(data){
                const allProjek = await Projek.findAll()
                return response(11, 'success add new projek', allProjek)
            }else{
                return response(511, 'fail add new projek', null)
            }
        } catch (error) {
            return response(411, error.message, null)
        }
    }

    static editProjek = async (prefix) => {
        try {
            const payload = {
                nama_projek: prefix[3],
                initial: prefix[4],
                b_active: prefix[5]
            }
            const editData = await Projek.update({no_projek: prefix[2]}, payload)
            if(editData){
                const allProjek = await Projek.findAll()
                return response(12, `success delete projek, no_projek: ${prefix[2]}`, allProjek)
            }else{
                return response(512, `fail edit projek, no_projek: ${prefix[2]}`, null)
            }
        } catch (error) {
            return response(412, error.message, null)       
        }
    }

    static deleteProjek = async (prefix) => {
        try {
            const deleteData = await Projek.delete({no_projek: prefix[2]})
            if(deleteData){
                const allProjek = await Projek.findAll()
                return response(13, `success delete projek, no_projek: ${prefix[2]}`, allProjek)
            }else{
                return response(513, `fail delete projek, no_projek: ${prefix[2]}`, null)
            }
        } catch (error) {
            return response(413, error.message, null)
        }
    }
}

module.exports = {
    ProjekController
}