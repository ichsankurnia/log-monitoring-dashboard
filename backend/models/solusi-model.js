const { db, commonQueryInsert, commonQueryUpdate, commonQueryDelete } = require("./database")

const tableName = 'public.solusi'

let queryGetAllSolusi = `
     SELECT sol.id_solusi, sol.nama_solusi, pen.no_penyebab, pen.penyebab, pen.kategori, sol.b_active
     FROM ${tableName} AS sol
     LEFT JOIN public.penyebab AS pen
     ON sol.no_penyebab = pen.no_penyebab   
`

class Solusi {
    static findAll = async () => {
        const sql = queryGetAllSolusi
        console.log(sql)

        try {
            const result = await db.query(sql)
            console.log(result.rows, result.rowCount)
            return result.rows
        } catch (error) {
            console.error(error.message)
            return false
        }
    }

    static findOne = async (identity) => {
        let where = ' WHERE '
        let x = 0

        Object.keys(identity).map(key => {
            x += 1
            if(x > 1){
                where += (typeof identity[key] === 'number')? ` AND sol.${key} = ${identity[key]}` : ` AND sol.${key} = '${identity[key]}'`
            }else{
                where += (typeof identity[key] === 'number')? `sol.${key} = ${identity[key]}` : `sol.${key} = '${identity[key]}'`
            }
        })

        const sql = queryGetAllSolusi + where
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
        const sql = commonQueryInsert(payload)
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
                console.log(`SOLUSI WITH ID ${JSON.stringify(identity)} NOT FOUND`)
                return false
            }
        } catch (error) {
            console.error(error.detail)
            return false
        }
    }

    static delete = async (identity) => {
        const sql = commonQueryDelete(tableName, identity, payload)
        console.log(sql)

        try {
            const result = await db.query(sql)
            if(result.rowCount > 0){
                return result
            }else{
                console.log(`SOLUSI WITH ID ${JSON.stringify(identity)} NOT FOUND`)
                return false
            }
        } catch (error) {
            console.error(error.detail)
            return false
        }
    }
}

module.exports = Solusi