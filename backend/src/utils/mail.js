import Mailgen from "mailgen";
import { BrevoClient } from "@getbrevo/brevo";
import { ApiError } from "./api-error.js";
import { env } from "../config/env.js";

const sendEmail = async (options) => {
    const mailGenerator = new Mailgen({
        theme: "cerberus",
        product: {
            name: "CineScope",
            link: env.frontendUrl
        }
    })

    const emailTextual = mailGenerator.generatePlaintext(options.mailgenContent);
    const emailHTML = mailGenerator.generate(options.mailgenContent);

    try {
        const brevo = new BrevoClient({
            apiKey: env.brevoApiKey,
        })

        const result = await brevo.transactionalEmails.sendTransacEmail({
            subject: options.subject,
            htmlContent: emailHTML,
            sender: {
                name: "Team CineScope",
                email: env.mailFrom,
            },
            to: [
                {
                    email: options.email
                }
            ]
        });
    } catch (error) {
        throw new ApiError(500,"Failed to send email")
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
