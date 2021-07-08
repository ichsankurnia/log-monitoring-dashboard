const { db, commonQueryInsert, commonQueryUpdate, commonQueryDelete } = require("./database")

const tableName = 'public.stasiun'


/**
Different Types of SQL JOINs
Here are the different types of the JOINs in SQL:

(INNER) JOIN: Returns records that have matching values in both tables
LEFT (OUTER) JOIN: Returns all records from the left table, and the matched records from the right table
RIGHT (OUTER) JOIN: Returns all records from the right table, and the matched records from the left table
FULL (OUTER) JOIN: Returns all records when there is a match in either left or right table
**/

let queryGetAllLokasi = `
    SELECT st.ip, st.nama_stasiun, proj.no_projek, proj.nama_projek, st.b_active
    FROM ${tableName} AS st
    LEFT JOIN public.projek AS proj
    ON st.no_projek = proj.no_projek
`

class Lokasi{
    static findAll = async () => {
        const sql = queryGetAllLokasi
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
                where += (typeof identity[key] === 'number')? ` AND st.${key} = ${identity[key]}` : ` AND st.${key} = '${identity[key]}'`
            }else{
                where += (typeof identity[key] === 'number')? `st.${key} = ${identity[key]}` : `st.${key} = '${identity[key]}'`
            }
        })

        const sql = queryGetAllLokasi + where
        console.log(sql)

        try {
            const result = await db.query(sql)
            return result.rows[0]
        } catch (error) {
            console.error(error.message)
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
                return this.findOne(identity)
            }else{
                console.error(`LOKASI WITH ID ${JSON.stringify(identity)} NOT FOUND`)
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
                console.error(`LOKASI WITH ID ${JSON.stringify(identity)} NOT FOUND`)
                return false
            }
        } catch (error) {
            console.error(error.detail)
            return false
        }
    }
}

module.exports = Lokasi