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
    FROM ${tableName} 
    LEFT JOIN (
        SELECT count(*) as counts, no_penyebab
        FROM ${tableName} 
        GROUP BY no_penyebab
    ) as MasalahTerbanyak
    ON MasalahTerbanyak.no_penyebab = ${tableName}.no_penyebab
    LEFT JOIN public.projek as PROJ
    ON PROJ.no_projek = ${tableName}.no_projek
    LEFT JOIN public.stasiun as LOK
    ON LOK.ip = ${tableName}.ip
    LEFT JOIN public.et as PER
    ON PER.no_perangkat = ${tableName}.no_perangkat
    LEFT JOIN public.perangkat_vm as PART
    ON PART.no_pvm = ${tableName}.no_pvm
    LEFT JOIN public.penyebab as PEN
    ON PEN.no_penyebab = ${tableName}.no_penyebab 
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

    static detail = async (identity) => {
        const sql = `
        SELECT 
            no, tanggal_masalah, jam_masalah, tanggal_done, jam_done, jenislaporan, 
            PROJ.no_projek, PROJ.nama_projek, 
            LOK.ip, LOK.nama_stasiun, 
            PER.no_perangkat, PER.nama_perangkat, 
            PART.no_pvm, PART.nama_perangkat as nama_part,
            problem, PEN.no_penyebab, PEN.penyebab,
            solusi, no_user, sumber, refnumber, refnotrouble, teknisi, totaldowntime, arah_gate, status, pic_before, pic_after
        FROM ${tableName} 
        LEFT JOIN public.projek as PROJ
        ON PROJ.no_projek = ${tableName}.no_projek
        LEFT JOIN public.stasiun as LOK
        ON LOK.ip = ${tableName}.ip
        LEFT JOIN public.et as PER
        ON PER.no_perangkat = ${tableName}.no_perangkat
        LEFT JOIN public.perangkat_vm as PART
        ON PART.no_pvm = ${tableName}.no_pvm
        LEFT JOIN public.penyebab as PEN
        ON PEN.no_penyebab = ${tableName}.no_penyebab 
        WHERE no = '${identity.no}'
        `
        console.log(sql)

        try {
            const result = await db.query(sql)
            return result.rows[0]
        } catch (error) {
            console.error(error.message)
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
        FROM ${tableName} 
        LEFT JOIN public.projek as PROJ
            ON PROJ.no_projek = ${tableName}.no_projek
        LEFT JOIN public.stasiun as LOK
            ON LOK.ip = ${tableName}.ip
        LEFT JOIN public.et as PER
            ON PER.no_perangkat = ${tableName}.no_perangkat
        LEFT JOIN public.perangkat_vm as PART
            ON PART.no_pvm = ${tableName}.no_pvm
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

    static grafikMasalah = async () => {
        const sql = `
            select 
                (
                    select count(*) from ${tableName} where tanggal_done=current_date and status='Done'
                ) as masalah_selesai_hari_ini,
                (
                    select count(*) from ${tableName} where tanggal_done=current_date and status='Open' or status ='Pending'
                ) as masalah_belum_selesai_hari_ini,
                (
                    select count(*) from ${tableName} where status = 'Done'
                ) as total_masalah_selesai,
                (
                    select count(*) from ${tableName} where status = 'Open' or status ='Pending'
                ) as total_masalah_belum_selesai
        `

        try {
            const result = await db.query(sql)         
            return result.rows[0]
        } catch (error) {
            console.log(error)
            return false
        }
    }

    static grafikProjek = async () => {
        const sql = `
            select count(*) counts, te.no_projek, pro.nama_projek, pro.initial 
            from ${tableName} te
            left join projek pro on pro.no_projek = te.no_projek 
            group by (te.no_projek, pro.nama_projek, pro.initial)
            order by counts desc limit 10
        `

        try {
            const result = await db.query(sql)
            return result.rows
        } catch (error) {
            console.log(error)
            return false
        }
    }

    static grafikPerangkat = async () => {
        const sql = `
            select count(*) counts, te.no_perangkat, per.nama_perangkat, loc.nama_stasiun, pro.nama_projek
            from ${tableName} te
            left join et per on per.no_perangkat = te.no_perangkat 
            left join stasiun loc on loc.ip = te.ip
            left join projek pro on pro.no_projek = te.no_projek 
            group by (te.no_perangkat, per.nama_perangkat, te.ip, loc.nama_stasiun, te.no_projek, pro.nama_projek)
            order by counts desc limit 10
        `

        try {
            const result = await db.query(sql)
            return result.rows
        } catch (error) {
            console.log(error)
            return false
        }
    }

    static grafikPart = async () => {
        const sql = `
            select count(*) counts, te.no_pvm, part.nama_perangkat as nama_part
            from ${tableName} te
            left join perangkat_vm part on part.no_pvm= te.no_pvm 
            group by (te.no_pvm, nama_part)
            order by counts desc limit 10
        `

        try {
            const result = await db.query(sql)
            return result.rows
        } catch (error) {
            console.log(error)
            return false
        }
    }

    static grafikPenyebab = async () => {
        const sql = `
            select count(*) counts, te.no_penyebab, p2.penyebab
            from ${tableName} te
            left join penyebab p2 on p2.no_penyebab = te.no_penyebab 
            group by (te.no_penyebab, p2.penyebab)
            order by counts desc limit 10
        `

        try {
            const result = await db.query(sql)
            return result.rows
        } catch (error) {
            console.log(error)
            return false
        }
    }
    
    static detailGrafik = async (query) => {
        const sql = `
        SELECT 
            no, tanggal_masalah, jam_masalah, tanggal_done, jam_done, jenislaporan, 
            PROJ.no_projek, PROJ.nama_projek, 
            LOK.ip, LOK.nama_stasiun, 
            PER.no_perangkat, PER.nama_perangkat, 
            PART.no_pvm, PART.nama_perangkat as nama_part,
            problem, PEN.no_penyebab, PEN.penyebab,
            solusi, status, no_user, sumber, refnumber, refnotrouble, teknisi, totaldowntime, arah_gate
        FROM ${tableName} 
        LEFT JOIN public.projek as PROJ
        ON PROJ.no_projek = ${tableName}.no_projek
        LEFT JOIN public.stasiun as LOK
        ON LOK.ip = ${tableName}.ip
        LEFT JOIN public.et as PER
        ON PER.no_perangkat = ${tableName}.no_perangkat
        LEFT JOIN public.perangkat_vm as PART
        ON PART.no_pvm = ${tableName}.no_pvm
        LEFT JOIN public.penyebab as PEN
        ON PEN.no_penyebab = ${tableName}.no_penyebab 
        WHERE ${query}
        ORDER BY tanggal_done desc
        `
        
        try {
            const result = await db.query(sql)
            return result.rows
        } catch (error) {
            console.log(error)
            return false
        }
    }
}


module.exports = TroubleET