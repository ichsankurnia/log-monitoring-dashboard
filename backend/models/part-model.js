const { db, commonQueryGetAll, commonQueryGetOne, commonQueryInsert, commonQueryUpdate, commonQueryDelete } = require("./database")

const tableName = 'public.perangkat_vm'

class Part {
    static findAll = async () => {
        const sql = commonQueryGetAll(tableName)
        console.log(sql)

        try {
            const result = await db.query(sql)
            return result.rows
        } catch (error) {
            console.error(error.message)
            return false
        }
    }

    static findOne = async (identity) => {
        const sql = commonQueryGetOne(tableName, identity)
        console.log(sql)

        try {
            const result = await db.query(sql)
            return result.rows[0]
        } catch (error) {
            console.error(error.message)
            return false
        }
    }

    static create = async (payload) => {
        const sql = commonQueryInsert(tableName)
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
                return this.findOne(identity)
            }else{
                console.log(`PART WITH ID ${JSON.stringify(identity)} NOT FOUND`)
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
                console.log(`PART WITH ID ${JSON.stringify(identity)} NOT FOUND`)
                return false
            }
        } catch (error) {
            console.error(error.detail)
            return false
        }
    }
}

module.exports = Part