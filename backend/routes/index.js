const {Router} = require("express")
const { TroubleETController } = require("../controllers/troubleET-controller")
const { getAllUser, getOneUser, addNewUser, editUser, deleteUser } = require("../controllers/user-controller")

const router = Router()

router.get('/', (req,res) => {
    return res.json({code: 0, message: 'success', description: 'endPoint api log apps monitoring'})
})

router.get('/user', getAllUser)
router.get('/user/:no_user', getOneUser)
router.post('/user', addNewUser)
router.patch('/user/:no_user', editUser)
router.delete('/user/:no_user', deleteUser)

router.get('/troubleet', TroubleETController.getTrouble)
router.get('/troubleet/:ticket_id', TroubleETController.getDetailTrouble)
router.post('/troubleet', TroubleETController.addTrouble)
router.patch('/troubleet/:ticket_id', TroubleETController.editTrouble)
router.delete('/troubleet/:ticket_id', TroubleETController.deleteTrouble)
router.get('/troubleet-documentation', TroubleETController.getListDocumentation)

module.exports = router