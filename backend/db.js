const { db } = require('./models/database')

require('dotenv').config()

var response = (code, msg, data) => {
    return {
        code,
        message: msg,
        data
    }
}

var query  = ""
var value = null

const getUser = async (req, res) => {
    try {
        query = `SELECT * from "public"."user"`
        value = null
        const result = await db.query(query, value)
        console.log(result)
        res.json(response(0, 'success', result.rows))
    } catch (error) {
        console.log(error)
        res.json(response(1, error.message, null))
    }
}

const insetTroubleET = async (req, res) => {
    try {
        const {
            no_ticket, tanggal_masalah, jam_masalah, tanggal_done, jam_done, ip, problem, no_penyebab, solusi, no_perangkat, status, no_user, no_projek, 
            jenislaporan, no_pvm, sumber, refnotrouble, teknisi, totaldowntime, arah_gate, pic_before, pic_after
        } = req.body

        // console.log(new Buffer.from(pic_before))
        // console.log(pic_after.length)
        
        query = `insert into "public"."trouble_et" (
            no, tanggal_masalah, jam_masalah, tanggal_done, jam_done, ip, problem, no_penyebab, solusi, no_perangkat, status, no_user, no_projek, 
            jenislaporan, no_pvm, sumber, refnotrouble, teknisi, totaldowntime, arah_gate, pic_before, pic_after
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22)`
        
        value = [no_ticket, tanggal_masalah, jam_masalah, tanggal_done, jam_done, ip, problem, no_penyebab, solusi, no_perangkat, status, no_user, no_projek, 
            jenislaporan, no_pvm, sumber, refnotrouble, teknisi, totaldowntime, arah_gate, pic_before, pic_after]
        
        await db.query(query, value)
        res.json(response(0, 'success', req.body))
    } catch (error) {
        console.log(error)
        res.json(response(1, error.message, null))
    }
}

const getTroubleET = async (req, res) => {
    try {
        var arrRes = []
        // query = `select no, tanggal_masalah, jam_masalah, tanggal_done, jam_done, jenislaporan, no_projek, ip, no_perangkat,
        // no_pvm, problem, MasalahTerbanyak.no_penyebab, solusi, status, no_user, sumber, refnumber, refnotrouble, 
        // teknisi, pic_before, pic_after, totaldowntime, arah_gate, counts 
        // from "public"."trouble_et"
        // left join ( 
        // 	select count(*) as counts, no_penyebab from "public"."trouble_et" where tanggal_done > CURRENT_DATE - interval '3 month'
        // 	group by no_penyebab order by counts desc limit 200
        // 	) as MasalahTerbanyak
        // on MasalahTerbanyak.no_penyebab = "public"."trouble_et".no_penyebab`
        query = `select * from "public"."trouble_et" where no='20210701MyG0000000099'`
        value = null
        const result = await db.query(query, value)
        if(result.rows.length > 0){
            result.rows.forEach(data => {
                const bytePicBefore = JSON.parse(JSON.stringify(data.pic_before)).data
                const bytePicAfter = JSON.parse(JSON.stringify(data.pic_before)).data

                const row = {
                    no: data.no,
                    tanggal_masalah: data.tanggal_masalah,
                    jam_masalah: data.jam_masalah,
                    tanggal_done: data.tanggal_done,
                    jam_done: data.jam_done,
                    jenislaporan: data.jenislaporan,
                    no_projek: data.no_projek,
                    ip: data.ip,
                    no_perangkat: data.no_perangkat,
                    no_pvm: data.no_pvm,
                    problem: data.problem,
                    no_penyebab: data.no_penyebab,
                    solusi: data.solusi,
                    status: data.status,
                    no_user: data.no_user,
                    sumber: data.sumber,
                    refnumber: data.refnumber,
                    refnotrouble: data.refnotrouble,
                    teknisi: data.teknisi,
                    pic_before: data.pic_before,
                    pic_after: typeof bytePicAfter,
                    totaldowntime: data.totaldowntime,
                    arah_gate: data.arah_gate,
                    counts: data.counts
                }
                arrRes = [...arrRes, row]
                
                console.log("data :", Int8Array.from(data.pic_before), Int8Array.from(data.pic_before).length)
            })
        }
        res.json(response(0, 'success', arrRes))
    } catch (error) {
        console.log(error)
        res.json(response(1, error.message, null))
    }
}


module.exports = {
    getUser, getTroubleET, insetTroubleET
}