const nodemailer = require('nodemailer');

const sender = 'premiumkinobot@gmail.com';
const receiver = 'premiumkinobot@gmail.com';
const password = 'xbguckzhonlehivd';


const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: false,
    service: 'Gmail',
    auth: {
        user: sender,
        pass: password
    }
});


send = (message) =>
{

    const mailOptions = {
        from: sender,
        to: receiver,
        subject: 'Module m0306',
        text: message
    }

    transporter.sendMail(mailOptions, (err, info) => {
        err ? console.log(err) : console.log('Sent: ' + info.response);
    })
}

module.exports = send;