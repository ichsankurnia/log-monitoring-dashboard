const {Router} = require("express")

const { TroubleETController } = require("../controllers/troubleET-controller")
const { getAllUser, getOneUser, addNewUser, editUser, deleteUser } = require("../controllers/user-controller")
const login = require("../middlewares/authenticate")
const Login = require("../models/login-model")

const router = Router()

router.get('/', (req,res) => {
    return res.json({code: 0, message: 'success', description: 'endPoint api log apps monitoring'})
})

router.post('/auth/login', login)
router.post('/auth/logout', async (req, res) => {
    try {
        const data = await Login.update(req.body)
        if(data){
            return res.json({code: 0, message: 'success logout', data})
        }else{
            return res.json({code: 1, message: 'failed to logout', data: null})
        }
    } catch (error) {
        return res.json({code: 1, message: error.message, data: null})
    }
})

router.get('/user', getAllUser)
router.get('/user/:no_user', getOneUser)
router.post('/user', addNewUser)
router.patch('/user/:no_user', editUser)
router.delete('/user/:no_user', deleteUser)

router.get('/troubleet', TroubleETController.getTrouble)
router.get('/troubleet/:ticket_id', TroubleETController.getOneTrouble)
router.get('/troubleet-detail/:ticket_id', TroubleETController.getDetailTrouble)
router.post('/troubleet', TroubleETController.addTrouble)
router.patch('/troubleet/:ticket_id', TroubleETController.editTrouble)
router.delete('/troubleet/:ticket_id', TroubleETController.deleteTrouble)
router.get('/troubleet-documentation', TroubleETController.getListDocumentation)

module.exports = router