require('dotenv').config()
const jwt = require('jsonwebtoken')
const Login = require('../models/login-model')
const User = require('../models/user-model')

const login = async (req, res) => {
    try {
        const {username, password} = req.body
        const data = await User.findOne({username: username})

        if(data){

            const dataByPass = await User.findOne({username: username, password: password})
            
            if(dataByPass){
                const login = await Login.findOne({no_user: parseInt(dataByPass.no_user)})
                if(login){
                    if(login.login_status === 'f' || login.login_status === undefined){
                        await Login.create({
                            no_user: dataByPass.no_user,
                            d_login: new Date().toISOString(),
                            d_logout: new Date().toISOString(), 
                            login_status: 't'
                        })
    
                        const token = jwt.sign(dataByPass, process.env.JWT_KEY, { expiresIn: '1d' });
                
                        return res.json({ code: 0, message: 'Success authenticate', data: data, token: token });
                    }else{
                        return res.json({ code: 1, message: 'This user is active in other place', data: null });
                    }
                }else{
                    return res.json({ code: 1, message: 'failed password', data: null });
                }
            }else{
                return res.json({ code: 1, message: 'Wrong password', data: null });
            }
        }else{
            return res.json({ code: 1, message: 'Username not registered', data: null });
        }
    } catch (error) {
        return res.send({code:1, message: error.message, data: null})
    }
}

module.exports = login
