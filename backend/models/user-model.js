const { db, commonQueryGetOne, commonQueryGetAll, commonQueryInsert, commonQueryUpdate, commonQueryDelete } = require("./database")

const tableName = 'public.user'

class User {
   static findOne = async (idenity) => {
        // const sql = ` SELECT * FROM public.user WHERE no_user = ${noUser}`
        // const sql = {
        //     // give the query a unique name
        //     name: 'fetch-user',
        //     text: 'SELECT * FROM public.user WHERE no_user = $1',
        //     values: [noUser],
        // }
        const sql = commonQueryGetOne(tableName, idenity)
        console.log(sql)

        try {
            let result = await db.query(sql)
            return result.rows[0]
        } catch (error) {
            console.log(error)
            return false
        }
    }

    static findAll = async () => {
        const sql = commonQueryGetAll(tableName)
        console.log(sql)

        try {
            let result = await db.query(sql)
            return result.rows
        } catch (error) {
            console.log(error)
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
            console.error(error.detail)
            return false
        }
    }

    static update = async (identity, payload) => {
        const sql = commonQueryUpdate(tableName, identity, payload)
        console.log(sql)

        try {
            const result = await db.query(sql)
            if(result.rowCount > 0){
                const data = this.findOne(identity)
                return data
            }else{
                return false
            }
        } catch (error) {
            console.error(error.detail)
            return false
        }
    }

    static delete = async (identity) => {
        const sql = commonQueryDelete(tableName, identity)
        console.log(sql)

        try {
            const result = await db.query(sql)
            if(result.rowCount > 0){
                return result
            }else{
                console.log(`USER WITH ID ${JSON.stringify(identity)} NOT FOUND`)
                return false
            }
        } catch (error) {
            console.error(error.detail)
            return false
        }
    }
}

module.exports = User