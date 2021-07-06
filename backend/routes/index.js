const {Router} = require("express")
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

module.exports = router