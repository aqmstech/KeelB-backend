import { Utils } from "../../../utils/utils";
import aws4 from 'aws4'
import axios from 'axios'
import { EmailPayload, MailResponse, AWSCredentrials } from "./mailInterface";
import nodemailer, { Transporter } from 'nodemailer';
import MailTemplates from "../../../utils/enums/mailTemplates";
import RestaurantStatus from "../../../utils/enums/restaurantStatus";




export abstract class Mail {
    private static transporter: Transporter;

    static async configureTransporter() {
        const conf: any = await Utils.LoadEnv();
        const { auth, host, port, secure } = conf.SMTP.GMAIL;
        Mail.transporter = nodemailer.createTransport({
            host: host,   // Replace with your SMTP server
            port: port,                  // Port for TLS
            secure: secure,              // Use TLS (false for port 587)
            auth: {
                user: auth?.user, // Replace with your email
                pass: auth?.pass,          // Replace with your password or app password
            },
        });
    }


    // public static async sendEmail(recipient: string, subject: string, data: Object, template_name: string, action_type: string): Promise<MailResponse> {
    //
    //     try {
    //         const conf: any = await Utils.LoadEnv();
    //         const { SMTP_ENDPOINT, SMTP_ACCESS_KEY, SMTP_SECRET_KEY, SMTP_PROJECT_NAME, SMTP_SENDER_EMAIL, SMTP_MESSAGE } = conf.SMTP.MAIL_SERVICE;
    //
    //         const emailPayload: EmailPayload = {
    //             "msg": SMTP_MESSAGE,
    //             "data": {
    //                 "to": recipient,
    //                 "subject": subject,
    //                 "data": data,
    //                 "projectName": SMTP_PROJECT_NAME,
    //                 "templateName": template_name,
    //                 "from": SMTP_SENDER_EMAIL,
    //             },
    //         };
    //
    //         const formData = new URLSearchParams();
    //         formData.append('Action', action_type);
    //         formData.append('MessageBody', JSON.stringify(emailPayload));
    //
    //         const awsHeaders = {
    //             host: new URL(SMTP_ENDPOINT).host,
    //             'content-type': 'application/x-www-form-urlencoded',
    //         };
    //
    //         const awsCredentials: AWSCredentrials = {
    //             accessKeyId: SMTP_ACCESS_KEY,
    //             secretAccessKey: SMTP_SECRET_KEY,
    //         };
    //
    //         const signedRequest = aws4.sign(
    //             {
    //                 host: awsHeaders.host,
    //                 path: new URL(SMTP_ENDPOINT).pathname,
    //                 method: 'POST',
    //                 headers: awsHeaders,
    //                 body: formData.toString(),
    //             },
    //             awsCredentials
    //         );
    //
    //         try {
    //
    //             let response =  await axios.post(SMTP_ENDPOINT, formData, {
    //                 headers: signedRequest.headers,
    //             });
    //
    //
    //             return {
    //                 "status": 200,
    //                 "message": "Email Sent"
    //             };
    //
    //         } catch (error: any) {
    //             console.log(error?.response?.data);
    //             return {
    //                 "status": error?.response?.status,
    //                 "message": "Email Sending Failed! CAUSE: " + error?.response?.data?.error
    //             }
    //         }
    //
    //     } catch (error: any) {
    //         console.log(error?.response?.data);
    //         return {
    //             "status": error?.response?.status,
    //             "message": "Email Sending Failed! CAUSE: " + error?.response?.data?.error
    //         }
    //     }
    // }


    public static async sendSMTPEmail(
        recipient: string,
        subject: string,
        data: Object,              // You can use this for dynamic data in templates
        template_name: string,     // Assuming you are rendering templates for emails
        action_type: string        // Action type can be used for different use cases (e.g., "welcome", "reset_password")
    ): Promise<MailResponse> {
        try {
            const conf: any = await Utils.LoadEnv();
            const { auth, host, port, secure } = conf.SMTP.GMAIL;
            // Render email template (if needed, integrate template engine like Handlebars or EJS)
            const emailBody = this.renderTemplate(template_name, data); // You need to implement this method for template rendering

            // Set up email options
            const mailOptions = {
                from: '"KeeLB" <' + auth.user + '>',// Replace with your sender info
                to: recipient,
                subject: subject,
                text: emailBody,        // Plain text version of the email
                html: emailBody,        // HTML version (assuming template returns HTML)
            };

            // Send the email
            const info = await Mail.transporter.sendMail(mailOptions);
            return {
                "status": 200,
                "message": "Email Sent"
            };

        } catch (error) {
            console.error('Error sending email:', error);
            return {
                "status": error?.response?.status,
                "message": "Email Sending Failed! CAUSE: " + error?.response?.data?.error
            }
        }
    }

    private static renderTemplate(template_name: string, data: any): string {
        const logoSvg = `
       <svg xmlns="http://www.w3.org/2000/svg" width="164" height="69" viewBox="0 0 134 49" fill="none">
        <path d="M102.29 42.9998L100.19 45.1598V48.5498H97.73V35.2798H100.19V42.0898L106.75 35.2798H109.52L103.95 41.2098L109.87 48.5498H106.99L102.31 42.9898L102.29 42.9998Z" fill="#D1202B"/>
        <path d="M119.48 44.2498H111.54C111.82 45.7298 113.06 46.6798 114.82 46.6798C115.96 46.6798 116.85 46.3198 117.57 45.5798L118.84 47.0398C117.93 48.1198 116.51 48.6898 114.76 48.6898C111.37 48.6898 109.17 46.5098 109.17 43.4998C109.17 40.4898 111.39 38.3198 114.4 38.3198C117.41 38.3198 119.52 40.3898 119.52 43.5498C119.52 43.7398 119.5 44.0198 119.48 44.2498ZM111.52 42.6798H117.26C117.07 41.2198 115.95 40.2198 114.4 40.2198C112.85 40.2198 111.75 41.2098 111.52 42.6798Z" fill="#D1202B"/>
        <path d="M130.58 44.2498H122.64C122.92 45.7298 124.16 46.6798 125.92 46.6798C127.06 46.6798 127.95 46.3198 128.67 45.5798L129.94 47.0398C129.03 48.1198 127.61 48.6898 125.86 48.6898C122.47 48.6898 120.27 46.5098 120.27 43.4998C120.27 40.4898 122.49 38.3198 125.5 38.3198C128.51 38.3198 130.62 40.3898 130.62 43.5498C130.62 43.7398 130.6 44.0198 130.58 44.2498ZM122.62 42.6798H128.36C128.17 41.2198 127.05 40.2198 125.5 40.2198C123.95 40.2198 122.85 41.2098 122.62 42.6798Z" fill="#D1202B"/>
        <path d="M4.34006 32.6599C4.34006 32.5599 4.34006 32.4599 4.34006 32.3599C4.34006 16.5099 17.2401 3.60988 33.0901 3.60988C36.5401 3.60988 39.8601 4.21988 42.9301 5.34988L42.9101 5.36988C49.1701 13.1199 49.8701 21.1199 45.0601 29.8399L48.0701 31.4999C52.4801 23.4999 52.7901 15.7699 49.0301 8.45988C56.7501 13.6199 61.8401 22.4099 61.8401 32.3699C61.8401 32.4699 61.8401 32.5699 61.8401 32.6699H65.3601C65.3601 32.5799 65.3601 32.4799 65.3601 32.3899H91.8801C92.1701 32.3899 92.4401 32.3199 92.7001 32.1799C92.9601 32.0499 93.1701 31.8599 93.3301 31.6199L98.1901 24.6799L103.44 31.6599C103.52 31.7699 103.62 31.8699 103.73 31.9599C103.84 32.0499 103.95 32.1199 104.08 32.1899C104.21 32.2499 104.34 32.2999 104.47 32.3299C104.61 32.3599 104.74 32.3699 104.88 32.3699C105.02 32.3699 105.16 32.3499 105.29 32.3099C105.43 32.2799 105.56 32.2199 105.68 32.1599C105.8 32.0899 105.92 32.0199 106.02 31.9199C106.12 31.8299 106.22 31.7199 106.3 31.6099L111.17 24.6699L116.43 31.6599C116.51 31.7699 116.61 31.8699 116.72 31.9599C116.83 32.0499 116.94 32.1199 117.07 32.1899C117.2 32.2599 117.33 32.2999 117.46 32.3299C117.6 32.3599 117.73 32.3699 117.87 32.3699C118.01 32.3699 118.15 32.3499 118.28 32.3099C118.42 32.2699 118.55 32.2199 118.67 32.1599C118.79 32.0999 118.91 32.0199 119.01 31.9199C119.11 31.8299 119.21 31.7199 119.29 31.6099L124.1 24.7499L129.62 32.6599H133.95L125.56 20.6399C125.5 20.5499 125.43 20.4799 125.36 20.3999C125.27 20.3099 125.17 20.2299 125.06 20.1599C124.95 20.0899 124.84 20.0299 124.71 19.9899C124.59 19.9499 124.46 19.9199 124.34 19.8999C124.21 19.8799 124.08 19.8799 123.95 19.8999C123.82 19.9199 123.69 19.9399 123.57 19.9799C123.45 20.0199 123.33 20.0699 123.22 20.1399C123.11 20.2099 123 20.2799 122.91 20.3699C122.81 20.4599 122.73 20.5499 122.66 20.6599L117.79 27.5999L112.75 20.8999L112.53 20.6099C112.45 20.4999 112.35 20.3999 112.24 20.3099C112.13 20.2199 112.02 20.1499 111.89 20.0899C111.76 20.0299 111.63 19.9799 111.5 19.9499C111.36 19.9199 111.23 19.9099 111.09 19.9099C110.95 19.9099 110.81 19.9299 110.68 19.9699C110.54 20.0099 110.42 20.0599 110.29 20.1199C110.17 20.1899 110.05 20.2599 109.95 20.3599C109.85 20.4499 109.75 20.5599 109.67 20.6699L104.8 27.6099L99.9901 21.2199L99.5501 20.6299C99.4701 20.5199 99.3701 20.4199 99.2601 20.3299C99.1501 20.2399 99.0401 20.1699 98.9101 20.0999C98.7801 20.0399 98.6501 19.9899 98.5201 19.9599C98.3801 19.9299 98.2501 19.9099 98.1101 19.9199C97.9701 19.9199 97.8301 19.9399 97.7001 19.9699C97.5701 19.9999 97.4301 20.0499 97.3101 20.1199C97.1901 20.1899 97.0701 20.2599 96.9701 20.3599C96.8601 20.4499 96.7701 20.5599 96.6901 20.6699L90.9501 28.8599H65.1501C63.3901 12.7299 49.6801 0.129883 33.0801 0.129883C15.2901 0.129883 0.810059 14.6099 0.810059 32.3999C0.810059 32.4999 0.810059 32.5999 0.810059 32.6999H4.33006L4.34006 32.6599Z" fill="black"/>
        <path fill-rule="evenodd" clip-rule="evenodd" d="M37.6703 19.6998C37.5803 14.9298 33.6303 11.0498 28.8503 11.0498C24.6803 11.0498 21.2503 14.0098 20.5103 17.9298C20.7703 17.0798 21.2803 15.9898 22.2703 15.0698C24.2103 13.2598 25.6803 13.0598 25.6803 13.0598C21.2603 15.3898 20.1203 20.9098 21.7203 24.1998C22.6503 25.6698 24.0103 26.8598 25.6103 27.5698C26.0603 27.6798 26.4903 27.6998 26.4803 27.0898C26.2103 26.0598 25.6103 24.0798 25.3103 23.7998C24.9203 23.4398 24.0503 23.6298 23.7003 23.1998C23.3503 22.7598 22.0503 17.1998 22.0503 17.1998C22.0503 17.1998 22.1703 17.0698 22.2903 17.1098C22.4103 17.1598 23.8503 22.1198 23.9903 22.2298C24.1303 22.3398 24.1103 22.2798 24.1903 22.2798C24.2503 22.2598 24.3403 22.2498 24.3603 22.0198C24.3803 21.7798 22.7703 17.1598 22.7703 17.0798C22.7703 16.9998 22.7403 16.7598 22.9303 16.7898C23.1103 16.8198 24.8103 21.6298 24.9203 21.7498C25.0303 21.8698 25.0903 21.8398 25.1703 21.8298C25.2203 21.7898 25.2703 21.7798 25.2703 21.6298C25.2703 21.4798 23.4003 16.7198 23.5103 16.5798C23.6303 16.4398 23.7703 16.6298 23.8203 16.6998C23.8703 16.7698 25.7003 21.3198 25.8603 21.4798C26.0203 21.6398 26.0903 21.5998 26.1503 21.5798C26.2203 21.5198 26.2403 21.5798 26.2803 21.4098C26.3203 21.2298 24.1403 16.5398 24.2003 16.4298C24.2603 16.3198 24.4403 16.3498 24.4403 16.3498C24.4403 16.3498 27.1103 21.4198 27.1303 21.9698C27.1603 22.5298 26.3503 22.9898 26.3003 23.5098C26.2603 23.9098 27.2003 26.0798 27.7503 27.1898C27.8703 27.3998 28.0603 27.6898 28.3203 27.7898C28.7503 27.9698 28.9203 27.7998 28.9303 27.3698L28.9803 22.4798C28.9603 22.3098 28.9303 22.1498 28.8803 22.0298C28.8103 21.8998 28.7203 21.8098 28.6303 21.7398C27.7803 21.4498 27.1503 20.6298 27.1203 19.1498C27.0903 17.2798 28.0203 15.0798 29.2403 15.0798C30.4603 15.0798 31.4803 17.2798 31.5103 19.1498C31.5403 20.5398 31.0103 21.3498 30.2403 21.6798C30.1503 21.7598 30.0303 21.8798 29.9503 22.0298C29.9003 22.1298 29.8703 22.3198 29.8703 22.4998L30.0603 27.2598C30.0603 27.2598 30.2103 27.7298 30.4703 27.7198C30.6003 27.7198 30.6903 27.5498 30.7403 27.3898C30.7403 27.3898 30.7603 27.3198 30.7903 27.2098C30.8003 27.1398 30.8103 27.0898 30.8103 27.0898H30.8203C31.2703 25.5998 33.2703 18.8398 33.4203 18.1798C33.5903 17.4398 34.0603 15.7498 34.5603 16.0298C35.0603 16.3198 35.2603 18.4498 34.9603 20.7898C34.6603 23.1298 34.1103 24.5098 33.5403 25.0898C32.9703 25.6698 32.3103 25.2798 32.0503 25.9998C31.8703 26.4898 31.7503 27.0398 31.6903 27.3498C31.7103 27.4498 31.7803 27.6798 32.0203 27.7198C32.1403 27.7398 32.2803 27.7198 32.4103 27.6798C32.5103 27.6398 32.6103 27.5998 32.7103 27.5498C35.7003 26.1998 37.7503 23.1698 37.6803 19.6498" fill="#D1202B"/>
      </svg>
    `;
        const logoImg = `<img src="https://keelb-backend.s3.us-east-1.amazonaws.com/users%2F1728837889173.png" alt="Logo" width="266.28px" height="97.12px">`;

        if (template_name === MailTemplates.VERIFY_ACCOUNT) {
            return `
            <html>
                <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; color: #333;">
                    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 8px;">
                        <div style="text-align: center;padding: 20px">
                          ${logoImg}
                           <p style="font-size: 12px;color: #777;font-style: italic;font-family: cursive;">Your Guide to Lebanon's Culinary Gems</p>
                        </div>
                        <h1 style="color: #333;">Welcome, ${data['user']}!</h1>
                        <p style="font-size: 16px;">Thank you for signing up. To verify your account, please use the following OTP:</p>
                        <div style="text-align: center; margin: 20px 0;">
                            <span style="display: inline-block; font-size: 24px; font-weight: bold; padding: 10px 20px; border: 2px solid #ff0000; border-radius: 8px; color: #ff0000;">${data['otp']}</span>
                        </div>
                        <p style="font-size: 14px; color: #777;">If you did not request this OTP, please ignore this email.</p>
                        <p style="font-size: 14px; color: #777;">Thanks, <br>KeelB Team</p>
                    </div>
                </body>
            </html>
        `;
        } else if (template_name === MailTemplates.RESET_PASSWORD) {
            return `
            <html>
                <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; color: #333;">
                    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 8px;">
                        <div style="text-align: center;padding: 20px">
                           ${logoImg}
                            <p style="font-size: 12px;color: #777;font-style: italic;font-family: cursive;">Your Guide to Lebanon's Culinary Gems</p>
                        </div>
                        <h1 style="color: #333;">Reset Your Password</h1>
                        <p style="font-size: 16px;">To reset your password, please use the following OTP:</p>
                        <div style="text-align: center; margin: 20px 0;">
                            <span style="display: inline-block; font-size: 24px; font-weight: bold; padding: 10px 20px; border: 2px solid #ff0000; border-radius: 8px; color: #ff0000;">${data['otp']}</span>
                        </div>
                        <p style="font-size: 14px; color: #777;">If you did not request a password reset, please ignore this email.</p>
                        <p style="font-size: 14px; color: #777;">Thanks, <br>KeelB Team</p>
                    </div>
                </body>
            </html>
        `;
        } else if (template_name === MailTemplates.RESTAURANT_REQUEST_UPDATE) {
            return `
           <html>
    <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 8px;">
            <div style="text-align: center; padding: 20px">
                ${logoImg}
                <p style="font-size: 12px; color: #777; font-style: italic; font-family: cursive;">Your Guide to Lebanon's Culinary Gems</p>
            </div>
            <h1 style="color: #333;">Hello, ${data['user']}!</h1>
            
            <p style="font-size: 16px;">Thank you for submitting your request to publish your restaurant on our platform. We appreciate your interest in joining our community.</p>

            <h2 style="color: #333;">Submission Status: ${data['status']}</h2>
            
            ${data['status'] === RestaurantStatus.ACCEPTED ? `
                <p style="font-size: 16px;">We are pleased to inform you that your request has been approved! Your restaurant will now be listed on our platform. We appreciate your contribution to enhancing our offerings, and we are excited to help you reach more customers.</p>
            ` : `
                <p style="font-size: 16px;">Unfortunately, we regret to inform you that your submission has been rejected. The reason for this decision is as follows:</p>
                <p style="font-size: 16px; color: #ff0000;"><strong>${data['reason']}</strong></p>
                <p style="font-size: 16px;">We encourage you to review the feedback and resubmit your application once the necessary adjustments have been made. If you have any questions or need assistance, please don't hesitate to reach out.</p>
            `}

            <h3 style="color: #333;">Next Steps:</h3>
            <ul style="font-size: 16px;">
                ${data['status'] === RestaurantStatus.ACCEPTED ? `
                    <li>You can log in to your account to manage your restaurant data & settings.</li>
                ` : `
                    <li>Please reply to this email or contact our support team for further clarification or assistance.</li>
                `}
            </ul>

            <p style="font-size: 16px;">Thank you for your understanding and patience throughout this process. We look forward to working with you!</p>

            <p style="font-size: 14px; color: #777;">Thanks, <br>KeelB Team</p>
        </div>
    </body>
</html>

        `;
        }else if (template_name === MailTemplates.RESEND_OTP) {
            return `
            <html>
                <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; color: #333;">
                    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 8px;">
                        <div style="text-align: center;padding: 20px">
                           ${logoImg}
                            <p style="font-size: 12px;color: #777;font-style: italic;font-family: cursive;">Your Guide to Lebanon's Culinary Gems</p>
                        </div>
                        <h1 style="color: #333;">Complete your verification</h1>
                        <p style="font-size: 16px;">We received your request to resend the One-Time Password (OTP) for verification. Please use the following OTP to complete your verification:</p>
                        <div style="text-align: center; margin: 20px 0;">
                            <span style="display: inline-block; font-size: 24px; font-weight: bold; padding: 10px 20px; border: 2px solid #ff0000; border-radius: 8px; color: #ff0000;">${data['otp']}</span>
                        </div>
                        <p style="font-size: 14px; color: #777;">If you did not request a password reset, please ignore this email.</p>
                        <p style="font-size: 14px; color: #777;">Thanks, <br>KeelB Team</p>
                    </div>
                </body>
            </html>
        `;
        }

        return `
        <html>
            <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; color: #333;">
                <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 8px;">
                    <h1 style="color: #333;">Default Email Template</h1>
                    <p style="font-size: 16px;">This is a default email template. Please provide a valid template name.</p>
                </div>
            </body>
        </html>
    `;
    }


}