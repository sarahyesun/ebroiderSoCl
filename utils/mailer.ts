import nodemailer from 'nodemailer';

const mailer = nodemailer.createTransport(process.env.SMTP_URL);

export default mailer;
