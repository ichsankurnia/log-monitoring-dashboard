const { db, commonQueryInsert, commonQueryUpdate, commonQueryDelete } = require("./database")

const tableName = 'public.penyebab'

let queryGetAllPenyebab = `
    SELECT pen.no_penyebab, pen.penyebab, pen.kategori, part.no_pvm, part.nama_perangkat, part.jenis, pen.b_active
    FROM ${tableName} as pen
    LEFT JOIN public.perangkat_vm as part
    ON pen.no_pvm = part.no_pvm
`

class Penyebab {
    static findAll = async () => {
        const sql = queryGetAllPenyebab
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
        let where = ' WHERE '
        let x = 0

        Object.keys(identity).map(key => {
            x += 1
            if(x > 1){
                where += (typeof identity[key] === 'number')? ` AND pen.${key} = ${identity[key]}` : ` AND pen.${key} = '${identity[key]}'`
            }else{
                where += (typeof identity[key] === 'number')? `pen.${key} = ${identity[key]}` : `pen.${key} = '${identity[key]}'`
            }
        })

        const sql = queryGetAllPenyebab + where
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
        const sql = commonQueryInsert(tableName, payload)
        console.log(sql)

        try {
            const result = await db.query(sql)
            return result.rows[0]
        } catch (error) {
            console.error(error.message)
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
                console.log(`PENYEBAB WITH ID ${JSON.stringify(identity)} NOT FOUND`)
                return false
            }
        } catch (error) {
            console.error(error.message)
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
                console.log(`PENYEBAB WITH ID ${JSON.stringify(identity)} NOT FOUND`)
                return false
            }
        } catch (error) {
            console.error(error.message)
            return false
        }
    }
}

module.exports = Penyebab