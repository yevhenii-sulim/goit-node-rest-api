import nodemailer from 'nodemailer';

const { META_API_KEY,META_API_EMAIL } = process.env;

const config = {
  host: 'smtp.meta.ua',
  port: 465,
  secure: true,
  auth: {
    user: META_API_EMAIL,
    pass: META_API_KEY,
  },
};

const transporter = nodemailer.createTransport(config);

const sendMail = (data)=>{
  const email = {...data, from:META_API_EMAIL}
  return transporter
  .sendMail(email)
}

export default sendMail