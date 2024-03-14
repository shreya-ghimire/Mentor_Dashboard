const nodemailer = require('nodemailer');

const sendEmail = async (studentEmail, totalScore) => {
  try {
    // Create a Nodemailer transporter
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: 'intelligentcoder6@gmail.com',
        pass: 'kvus xkkp ezyc avkw',
      },
    });

    // Send mail with defined transport object
    await transporter.sendMail({
      from: 'intelligentcoder6@gmail.com',
      to: studentEmail,
      subject: 'Your Result Published',
      text: `Your result has been published. Your final marks: ${totalScore}`,
    });

    console.log('Email sent successfully!');
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

module.exports = { sendEmail };
