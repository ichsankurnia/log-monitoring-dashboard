const { db, commonQueryInsert, commonQueryUpdate, commonQueryDelete } = require("./database")

const tableName = 'public.et'

let queryGetAllPerangkat = `
    SELECT pe.no_perangkat, pe.nama_perangkat, pe.id, pe.type, lok.ip, lok.nama_stasiun, pe.b_active
    FROM ${tableName} as pe
    LEFT JOIN public.stasiun AS lok
    ON pe.ip = lok.ip
`

class Perangkat {
    static findAll = async () => {
        const sql = queryGetAllPerangkat
        console.log(sql)

        try {
            const result = await db.query(sql)
            return result.rows
        } catch (error) {
            console.log(error.message)
        }
    }

    static findOne = async (identity) => {
        let where = ' WHERE '
        let x = 0

        Object.keys(identity).map(key => {
            x += 1
            if(x > 1){
                where += (typeof identity[key] === 'number')? ` AND pe.${key} = ${identity[key]}` : ` AND pe.${key} = '${identity[key]}'`
            }else{
                where += (typeof identity[key] === 'number')? `pe.${key} = ${identity[key]}` : `pe.${key} = '${identity[key]}'`
            }
        })

        const sql = queryGetAllPerangkat + where
        console.log(sql)

        try {
            const result = await db.query(sql)
            return result.rows[0]
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
            console.log(error.detail)
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
                console.log(`PERANGKAT WITH ID ${JSON.stringify(identity)} NOT FOUND`)
                return false
            }
        } catch (error) {
            console.log(error.detail)
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
                console.log(`PERANGKAT WITH ID ${JSON.stringify(identity)} NOT FOUND`)
                return false
            }
        } catch (error) {
            console.log(error.detail)
            return false
        }
    }
}

module.exports = Perangkat