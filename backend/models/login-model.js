const { db, commonQueryGetOne, commonQueryInsert, commonQueryUpdate, commonQueryDelete } = require("./database")

const tableName = 'public.login'

class Login {
    static findOne = async (identity) => {
        const sql = `
            SELECT * FROM public.login WHERE no_user = ${identity.no_user} order by nomer desc limit 1
        `
        console.log(sql)

        try {
            const result = await db.query(sql)
            if(result.rows.length > 0){
                return result.rows[0]
            }else{
                return true
            }
        } catch (error) {
            console.log(error.message)
            return false
        }
    }

    static create = async (payload) => {
        const sql = commonQueryInsert(tableName, payload)
        console.log(sql)

        try {
            await db.query(sql)
            return payload
        } catch (error) {
            console.log(error.message)
            return false
        }
    }

    static update = async (identity) => {
        const sql = `
            update ${tableName} set d_logout=now(), login_status='f' where no_user=${identity.no_user} and login_status='t'
        `
        console.log(sql)

        try {
            const result = await db.query(sql)
            if(result.rowCount > 0){
                return findLogin
            }else{
                return false
            }
            
        } catch (error) {
            console.log(error.message)
            return false
        }
    }

    static delete = async (identity) => {
        const sql = commonQueryDelete(tableName, identity)
        console.log(sql)

        try {
            const result = await db.query(sql)
            return result
        } catch (error) {
            console.log(error.message)
            return false
        }
    }
}

module.exports = Login