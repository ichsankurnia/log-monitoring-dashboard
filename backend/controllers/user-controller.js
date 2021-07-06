const User = require("../models/user-model")

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


module.exports = {
    getAllUser, 
    getOneUser,
    addNewUser,
    editUser,
    deleteUser
}