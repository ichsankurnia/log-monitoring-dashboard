const Lokasi = require('../models/lokasi-model')

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

class LokasiController {
    static getLokasi = async () => {
        try {
            const data = await Lokasi.findAll()
            return response(20, 'success get all lokasi', data)
        } catch (error) {
            return response(420, error.message, null)
        }
    }

    static addLokasi = async (prefix) => {
        try {
            const payload = {
                ip: parseInt(prefix[2]),
                nama_stasiun: prefix[3],
                no_projek: parseInt(prefix[4]),
                b_active: 't'
            }
            const addData = await Lokasi.create(payload)
            if(addData){
                const allLokasi = await Lokasi.findAll()
                return response(21, 'success add new lokasi', allLokasi)
            }else{
                return response(521, 'fail add new lokasi', null)
            }
        } catch (error) {
            return response(421, error.message, null)
        }
    }

    static editLokasi = async (prefix) => {
        try {
            const payload = {
                nama_stasiun: prefix[3],
                no_projek: parseInt(prefix[4]),
                b_active: prefix[5]
            }
            const editData = await Lokasi.update({ip: parseInt(prefix[2])}, payload)
            if(editData){
                const allLokasi = await Lokasi.findAll()
                return response(22, `success update lokasi: ip: ${prefix[2]}`, allLokasi)
            }else{
                return response(522, `fail update lokasi, ip: ${prefix[2]}`, null)
            }
        } catch (error) {
            return response(422, error.message, null)
        }
    }

    static deleteLokasi = async (prefix) => {
        try {
            const deleteData = await Lokasi.delete({ip: prefix[2]})
            if(deleteData){
                const allLokasi = await Lokasi.findAll()
                return response(23, `success delete lokasi, ip: ${prefix[2]}`, allLokasi)
            }else{
                return response(523, `fail delete lokasi, ip: ${prefix[2]}`, null)
            }
        } catch (error) {
            return response(423, error.message, null)
        }
    }
}


module.exports = {
    LokasiController
}