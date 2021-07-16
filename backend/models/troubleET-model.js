const { db, commonQueryInsert, commonQueryGetOne } = require("./database")

const tableName = 'public.trouble_et'

class TroubleET {
    static findAll = async () => {
        const sql = `
            SELECT 
                no, tanggal_masalah, jam_masalah, tanggal_done, jam_done, jenislaporan, no_projek, ip, no_perangkat,
                no_pvm, problem, no_penyebab, solusi, status, no_user, sumber, refnumber, refnotrouble,
                teknisi, totaldowntime, arah_gate
            FROM ${tableName}
            ORDER BY tanggal_done desc limit 500
        `
        console.log(sql)

        try {
            const result = await db.query(sql)
            return result.rows
        } catch (error) {
            console.log(error.message)
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
            console.log(error.message)
            return false
        }
    }

    static create = async (dataInsert) => {
        const sql = commonQueryInsert(tableName, dataInsert)
        console.log(sql)
        
        try {
            await db.query(sql)
            return dataInsert
        } catch (error) {
            console.log(error.message)
            return false
        }
    }


    static noTicket = async (noProjek) => {
        const sql = `
            SELECT max(right(no, 9)) 
            FROM ${tableName}
            WHERE no_projek=${noProjek}
        `
        console.log(sql)

        try {
            const result = await db.query(sql)
            if(result){
                let ticketNum = ""
                const max = result.rows[0].max
                let res = {
                    max: result.rows[0].max,
                    kode_projek: ''
                }
                const projek = await db.query(
                    `SELECT initial from public.projek where no_projek = ${noProjek}`
                )
                res.kode_projek = projek.rows[0].initial
                const projectCode = projek.rows[0].initial
                if(max === null){
                    ticketNum = `${projectCode}000000001`
                }else{
                    const s = parseInt(max) + 1
                    const j = s.toString().length;
                    let countZero = "";
                    for(let i=0; i<=9-j; i++){
                        countZero = countZero + "0";
                    }
                    ticketNum = projectCode + countZero + s
                }
                return {ticket_number : ticketNum}
            }else{
                return false
            }
        } catch (error) {
            console.log(error)
            return false
        }
    }

    static downTime = async (akhirDownTime, awlDownTime) => {
        const sql = `
            SELECT CONCAT (
                DATE_PART('day', '${akhirDownTime}'::timestamp - '${awlDownTime}'::timestamp), ' Hari ', 
                DATE_PART('hour', '${akhirDownTime}'::timestamp - '${awlDownTime}'::timestamp), ' Jam ', 
                DATE_PART('minute', '${akhirDownTime}'::timestamp - '${awlDownTime}'::timestamp), ' Menit'
            ) as downtime
        `
        console.log(sql)

        try {
            const result = await db.query(sql)
            if(result){
                return result.rows[0]
            }else{
                return false
            }          
        } catch (error) {
            console.log(error)
            return false
        }
    }

    static downTimeParah = async (hariDone, hariMasalah) => {
        const sql = `
            SELECT CONCAT (
                DATE_PART('day', '${hariDone}'::timestamp - '${hariMasalah}'::timestamp), ' Hari '
            ) as Durasi
        `
        console.log(sql)

        try {
            const result = await db.query(sql)
            if(result){
                return result
            }else{
                return false
            }
        } catch (error) {
            console.log(error)
            return false
        }
    }
}


module.exports = TroubleET