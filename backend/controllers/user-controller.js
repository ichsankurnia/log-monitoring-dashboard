const User = require("../models/user-model")

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


//#region EXPRESS REQUEST (API)
const getOneUser = async (req, res) => {
    try {
        const noUser = req.params.no_user
        const payload = {
            no_user: parseInt(noUser),
            telepon: "081234567890",
            status: "Admin"
        }
        const data = await User.findOne(payload)

        if(data){
            return res.json({code: 0, message: 'succces', data})
        }else{
            return res.json({code: 1, message: 'user not found, failed get user', data: null})
        }
    } catch (error) {
        console.log(error)
        return res.json({code: 1, message: error.message, data: null})
    }
}


const getAllUser = async (req, res) => {
    try {
        const data = await User.findAll()
        return res.json({code: 0, message: 'success', data})
    } catch (error) {
        return res.json({code: 1, message: error.message, data: null})
    }
}


const addNewUser = async (req, res) => {
    try {
        const data = await User.create(req.body)

        if(data){
            return res.json({code: 0, message: 'success', data})
        }else{
            return res.json({code: 1, message: 'failed add new user', data: null})
        }
    } catch (error) {
        return res.json({code: 1, message: error.message, data: null})
    }
}


const editUser = async (req, res) => {
    try {
        const { no_user } = req.params

        const data = await User.update({no_user: parseInt(no_user)}, req.body)
        if(data){
            return res.json({code:0, message: 'success', data})
        }else{
            return res.json({code: 1, message: 'failed update user', data: null})
        }
    } catch (error) {
        return res.json({code: 1, message: error.message, data: null})
    }
}


const deleteUser = async (req, res) => {
    try {
        const { no_user } = req.params
        const data = await User.delete({no_user: parseInt(no_user)})
        if(data){
            return res.json({code: 0, message: 'success', data})
        }else{
            return res.json({code: 1, message: 'failed delete user', data: null})
        }
    } catch (error) {
    }
}
//#endregion


//#region SOCKET REQUEST
class UserSocket{
    static getUser = async () => {
        try {
            const data = await User.findAll()
            return response(0, 'success', data)
        } catch (error) {
            return response(400, error.message, null)
        }
    }

    /**
     * 
     * @param {Array} prefix 
     * @returns 
     */
    static addUser = async (prefix) => {
        try {
            const payload = {
                "nama_user": prefix[2],
                "username": prefix[3],
                "password": prefix[4],
                "alamat": prefix[5],
                "telepon": prefix[6],
                "status": prefix[7],
                "b_active": "t"
            }

            const addData = await User.create(payload)
            if(addData){
                const data = await User.findAll()
                console.log(data)
                return response(1, 'success add new user', data)
            }else{
                return response(501, 'fail add new user', null)
            }
        } catch (error) {
            return response(401, error.message, null)
        }
    }

    /**
     * 
     * @param {Array} prefix 
     * @returns
     */
    static editUser = async (prefix) => {
        try {
            const payload = {
                "nama_user": prefix[3],
                "username": prefix[4],
                "password": prefix[5],
                "alamat": prefix[6],
                "telepon": prefix[7],
                "status": prefix[8],
                "b_active": prefix[9]
            }
            
            const editData = await User.update({no_user: parseInt(prefix[2])}, payload)
            if(editData){
                const data = await User.findAll()
                return response(2, 'success edit user', data)
            }else{
                return response(502, 'fail edit user', null)
            }
        } catch (error) {
            return response(402, error.message, null)
        }
    }

    /**
     * 
     * @param {Array<String>} prefix 
     * @returns 
     */
    static deleteUser = async (prefix) => {
        try {
            const deleteData = await User.delete({no_user: parseInt(prefix[2])})
            
            if(deleteData){
                const data = await User.findAll()
                return response(3, 'success delete user', data)
            }else{
                return response(503, 'fail delete user', null)
            }
        } catch (error) {
            return response(403, error.message, null)
        }
    }
}
//#region 


module.exports = {
    getAllUser, 
    getOneUser,
    addNewUser,
    editUser,
    deleteUser,
    UserSocket
}