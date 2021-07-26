require('dotenv').config()

var nodemailer = require('nodemailer');


const { GMAIL_USER, GMAIL_PASS, MAIL_RECIPIENTS } = process.env

const config = {
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 465,  // 587
    secure: true, // true for 465, false for other ports
    auth: {
        user: GMAIL_USER,
        pass: GMAIL_PASS
    }
}

const sendEmailFormAduan = async (desc, xlsBase64) => {
    var transporter = await nodemailer.createTransport(config);

    var mailOptions = {
        from: `"Operasional NI" ${GMAIL_USER}`,
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