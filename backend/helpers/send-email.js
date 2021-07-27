require('dotenv').config()

var nodemailer = require('nodemailer');


const { MAIL_HOST, MAIL_USER, MAIL_PASS, MAIL_RECIPIENTS } = process.env

const config = {
    // service: 'gmail',
    host: MAIL_HOST || 'goes2nobel.com',
    port: 465,  // 587
    secure: true, // true for 465, false for other ports
    auth: {
        user: MAIL_USER || 'info@goes2nobel.com',
        pass: MAIL_PASS || 'goestonobel123'
    }
}

const sendEmailFormAduan = async (desc, xlsBase64) => {
    var transporter = await nodemailer.createTransport(config);

    var mailOptions = {
        from: `"Operasional NI" ${MAIL_USER || 'info@goes2nobel.com'}`,
        to: MAIL_RECIPIENTS.split(','),
        subject: `Permintaan / Perbaikan Barang ${desc}`,
        text: "Berikut Terlampir Detail Permintaan", // plain text body
        attachments:[
            {   // data uri as an attachment
                path: xlsBase64
            },
        ]
    };
    
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log("Failed: ", error);
        } else {
            console.log('Email sent: ' + JSON.parse(info));
        }
    });
}

module.exports = { sendEmailFormAduan }