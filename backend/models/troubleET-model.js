const { db, commonQueryInsert, commonQueryGetOne, commonQueryUpdate, commonQueryDelete } = require("./database")

const tableName = 'public.trouble_et'

const queryGetAllTrouble = 
`
    SELECT 
        no, tanggal_masalah, jam_masalah, tanggal_done, jam_done, jenislaporan, 
        PROJ.no_projek, PROJ.nama_projek, 
        LOK.ip, LOK.nama_stasiun, 
        PER.no_perangkat, PER.nama_perangkat, 
        PART.no_pvm, PART.nama_perangkat as nama_part,
        problem, MasalahTerbanyak.no_penyebab, PEN.penyebab,
        solusi, status, no_user, sumber, refnumber, refnotrouble, teknisi, totaldowntime, arah_gate, counts
    FROM public.trouble_et 
    LEFT JOIN (
        SELECT count(*) as counts, no_penyebab
        FROM public.trouble_et 
        GROUP BY no_penyebab
    ) as MasalahTerbanyak
    ON MasalahTerbanyak.no_penyebab = public.trouble_et.no_penyebab
    LEFT JOIN public.projek as PROJ
    ON PROJ.no_projek = public.trouble_et.no_projek
    LEFT JOIN public.stasiun as LOK
    ON LOK.ip = public.trouble_et.ip
    LEFT JOIN public.et as PER
    ON PER.no_perangkat = public.trouble_et.no_perangkat
    LEFT JOIN public.perangkat_vm as PART
    ON PART.no_pvm = public.trouble_et.no_pvm
    LEFT JOIN public.penyebab as PEN
    ON PEN.no_penyebab = public.trouble_et.no_penyebab 
    ORDER BY counts IS NULL ASC, counts DESC, tanggal_done DESC
`

class TroubleET {
    static findAll = async () => {
        const sql = queryGetAllTrouble
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

    static update = async (identity, dataUpdate) => {
        const sql = commonQueryUpdate(tableName, identity, dataUpdate)
        console.log(sql)

        try {
            const result = await db.query(sql)
            if(result.rowCount > 0){
                const data = this.findOne(identity)
                return data
            }else{
                console.log(`TROUBLE ET WITH TICKET NUM ${JSON.stringify(identity)} NOT FOUND`)
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
            if(result.rowCount > 0){
                return result
            }else{
                console.log(`TROUBLE ET WITH TICKET NUM ${JSON.stringify(identity)} NOT FOUND`)
                return false
            }
        } catch (error) {
            console.log(error.message)
            return false
        }
    }

    static findDocumentation = async () => {
        const sql = `
        SELECT 
            no, tanggal_masalah, tanggal_done, 
            PROJ.no_projek, PROJ.nama_projek, 
            LOK.ip, LOK.nama_stasiun, 
            PER.no_perangkat, PER.nama_perangkat, PER.id as id_perangkat,
            PART.no_pvm, PART.nama_perangkat as nama_part,
            problem, solusi, pic_before, pic_after
        FROM public.trouble_et 
        LEFT JOIN public.projek as PROJ
            ON PROJ.no_projek = public.trouble_et.no_projek
        LEFT JOIN public.stasiun as LOK
            ON LOK.ip = public.trouble_et.ip
        LEFT JOIN public.et as PER
            ON PER.no_perangkat = public.trouble_et.no_perangkat
        LEFT JOIN public.perangkat_vm as PART
            ON PART.no_pvm = public.trouble_et.no_pvm
        WHERE pic_before IS NOT NULL 
            OR pic_after IS NOT NULL
        ORDER BY tanggal_done desc
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