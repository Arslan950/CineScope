import Mailgen from "mailgen";
import mailgen from "mailgen";
import nodemailer from "nodemailer";

const sendEmail = async (options) => {
    const mailGenerator = new Mailgen({
        theme: "cerberus",
        product: {
            name: "CineScope",
            link: "https://localhost:5174"
        }
    })

    const emailTextual = mailGenerator.generatePlaintext(options.mailgenContent);
    const emailHTML = mailGenerator.generate(options.mailgenContent);

    const transport = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS
        }
    });

    const mail = {
        from: "teamCineScope@example.com",
        to: options.email,
        subject: options.subject,
        text: emailTextual,
        html: emailHTML,
    }

    try {
        await transport.sendMail(mail)
    } catch (error) {
        console.error("Something went wrong ", error);
    }
}

const emailVerificationMail = (username, otp) => {
    return {
        body: {
            name: username,
            dictionary: {
                "Your OTP Code": otp,
                "Expires in": "10 minutes"
            },
            outro: "If you need help, please reply back to this email"
        }
    }
}

const resetPasswordMail = (username, resetPasswordUrl) => {
    return {
        body: {
            name: username,
            intro: "We received the request to change the password",
            action: {
                instructions: "To change your current password please click the following button",
                button: {
                    color: "#5fa2fa",
                    text: "Reset",
                    link: resetPasswordUrl
                },
            },
            outro: "If the request is not initiated by you, kindly ignore the mail"
        }
    }
}

export {
    emailVerificationMail,
    resetPasswordMail,
    sendEmail
}
