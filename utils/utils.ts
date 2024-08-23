import { Payload } from '../interfaces/payload';
import { Logger } from '../server/logger';
import axios from 'axios';
import { Sentry } from '../server/sentry';
import crypto from 'crypto';
import fs from 'fs/promises';
import upath from 'upath';
import nodemailer, { Transporter } from 'nodemailer';
import { Twilio } from 'twilio';
import {AuthModel} from "../module/_Auth/authModel";
import {UserdevicesModel} from "../module/_Userdevices/userdevicesModel";
import {SocialaccountsModel} from "../module/_Socialaccounts/socialaccountsModel";
import {DonationsModel} from "../module/Donations/donationsModel";

export class Utils {
    // private static salt = Application.conf?.ENCRYPTION.salt
    private static donationsModel: DonationsModel = new DonationsModel();

    /**
     *
     * @param ms
     * @returns void
     *
     * @Description : Testing methods for halting Thread
     */
    public static async Sleep(ms: number) {
        return new Promise((resolve: any, reject: any) => {
            setTimeout(() => {
                resolve();
            }, ms);
        });
    }


    public static async getCurrentDateUSFormat() {
        const now = new Date();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const year = now.getFullYear();

        return `${month}/${day}/${year}`;
    };

    public static capitalizeFirstLetter = (str: string) => {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    public static formatCardNumber = (cardNumber: string) => {
        const maskedDigits = cardNumber.slice(4, -4).replace(/\d/g, '*');
        const formattedCardNumber = cardNumber.slice(0, 4) + maskedDigits + cardNumber.slice(-4);
        return formattedCardNumber;
    }

    public static generateOrderNumber = () => {
        const uniqueId = Math.random().toString(36).substr(2, 9);
        const timestamp = Date.now().toString(36).substr(2, 9);
        return `${uniqueId}-${timestamp}`;
    }

    public static generateTrackingNumber() {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let trackingNumber = '';
        for (let i = 0; i < 10; i++) {
            trackingNumber += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return trackingNumber;
    }

    public static OTPGenerator() {
        let digits = '0123456789';
        let OTP = '';
        for (let i = 0; i < 4; i++) {
            OTP += digits[Math.floor(Math.random() * 10)];
        }
        return OTP;
    }

    public static GuestUserName() {
        let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let length = 12;
        let randomStr = '';
        for (let i = 0; i < length; i++) {
            let randomNum = Math.floor(Math.random() * characters.length);
            randomStr += characters[randomNum];
        }
        return 'Guest_' + randomStr;
    }

    public static ValidateEmail(e: string) {
        let email = e.toLowerCase();
        let emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        // Logger.Console(`Email ===> ${email}`, 'info');
        let checkEmail = email.match(emailRegex);
        // Logger.Console(`Check Rmail ${checkEmail}`, 'info')
        return { checkEmail, email };
    }

    public static async sendEmail(body: any) {
        try {
            const conf: any = await Utils.LoadEnv();
            console.log(conf.SMTP.GMAIL.auth.user);
            // Create a transporter object using your email service provider's SMTP details
            const transporter: Transporter = nodemailer.createTransport({
                host: conf.SMTP.GMAIL.host,
                port: conf.SMTP.GMAIL.port,
                secure: true,
                auth: {
                    user: conf.SMTP.GMAIL.auth.user,
                    pass: conf.SMTP.GMAIL.auth.pass
                }
            });

            // Define the email options
            const mailOptions = {
                from: conf.SMTP.GMAIL.auth.user,
                to: body.email,
                subject: body.subject,
                text: body.content
            };

            // Send the email
            const info = transporter.sendMail(mailOptions);
        } catch (error) {
            console.error(error);
        }
    }




    public static GenerateAccessToken(obj: Payload) {
        switch (obj.invoker) {
            case 'matches':
                return JSON.stringify(obj);
            case 'teams':
                return JSON.stringify(obj);
            default:
                console.log('Error in unknown service');
                throw new Error('Unknown Service');
        }
    }

    public static GenerateTeamObject(name: string, teamId: number, logoUrl: string, markUrl: string, fullName: string) {
        return { teamId, name, logoUrl, markUrl, fullName };
    }


    /**
     *
     * @param number <seconds>
     * @param type @Default <milliseconds>
     * @returns Date Object
     *
     * @Note : It will always add seconds to Current DateTime. However If you want to add Minut/Hours
     * Provide type explicitly.
     *
     */

    public static CalcPagination(currentpage: number, perPage: number) {
        let skip = perPage * (currentpage - 1)
        return { skip: skip, limit: perPage }
    }

    public static Pagination(data: object = {}, currentPage: number, perPage: number, total: number, key: any = "data") {
        return {
            [key]: data,
            pagination: {
                currentPage, perPage, total,
                lastPage: Math.ceil(total / perPage),
                firstPage: 1
            }
        }
    }

    public static CustomPagination(data: object = {}, currentPage: number, perPage: number, total: number, key: any = "data",keys:any) {
        console.log(keys,"keys")
        return {
            [key]: data,
            ...keys,
            pagination: {
                currentPage, perPage, total,
                lastPage: Math.ceil(total / perPage),
                firstPage: 1
            }
        }
    }

    public static GetFutureDate(number: number, type = 'ms'): Date {
        let date = new Date();
        switch (type) {
            case 'ms':
                number = number / 1000;
                break;
            case 'min':
                number = number * 60;
                break;
            case 'hours':
                number = number * 3600;
                break;
            default:
                break;
        }
        date.setSeconds(date.getSeconds() + number);
        return date;
    }

    /**
     *
     * @param number <seconds>
     * @param type @Default <milliseconds>
     * @returns <DATE ISO STRING>
     *
     * @Note : It will always add seconds to Current DateTime. However If you want to add Minut/Hours
     * Provide type explicitly.
     *
     */

    public static GetFutureDateISOString(number: number, type = 'ms'): string {
        let date = new Date();
        switch (type) {
            case 'ms':
                number = number / 1000;
                break;
            case 'min':
                number = number * 60;
                break;
            case 'hours':
                number = number * 3600;
                break;
            default:
                break;
        }
        date.setSeconds(date.getSeconds() + number);
        return date.toISOString();
    }

    public static ValidatePayload(payload: Payload) {
        try {
            let valid = true;
            if (!(payload as Object).hasOwnProperty('invoker')) valid = false;
            if (!(payload as Object).hasOwnProperty('expiry')) valid = false;
            if (!(payload as Object).hasOwnProperty('method')) valid = false;
            if (!(payload as Object).hasOwnProperty('url')) valid = false;
            if (!(payload as Object).hasOwnProperty('invokedFor')) valid = false;

            if (!valid) return false;
            else return true;
        } catch (error) {
            let err: any = error;
            Logger.Console(`error in Validate Payload ===> ${err.toString()}`, 'info');
            Sentry.Error(err, 'Error in Validating Payload UTILS');

            throw err.toString();
        }
    }

    public static isExpired(payload: Payload): boolean {
        return payload.expiry > new Date().toISOString() ? true : false;
    }

    public static async DownloadImage(url: string) {
        try {
            let res = await axios.get(url, { responseType: 'arraybuffer' });
            return Buffer.from(res.data, 'binary').toString('base64');
            //.then(response => Buffer.from(response.data, 'binary').toString('base64'))
        } catch (error) {
            let err: any = error;
            Sentry.Error(err, 'Error in Downloading IMage');
            Logger.Console(`Error: ${JSON.stringify(err.toString())}`, 'critical');
        }
    }

    public static TestError() {
        try {
            let data: any = {};
            console.log(data.name.abc);
        } catch (error) {
            throw error;
        }
    }

    public static GenerateEncodedValue(value: any) {
        let hash = crypto.createHash('sha256').update(value).digest('hex')
        return hash
    }

    public static async LoadEnv() {
        try {
            console.log(upath.normalize(process.cwd() + `\\.env.json`));
            return JSON.parse(
                (await fs.readFile(upath.normalize(process.cwd() + `\\.env.json`))).toString('utf-8')
            );
        } catch (error) {
            console.log(error)
            Logger.Log("..env.json is not found in root folder", 'error');
            return {};
        }
    }

    public static async Loadfile(path:string) {
        try {
            console.log(upath.normalize(process.cwd() + path));
            return JSON.parse(
                (await fs.readFile(upath.normalize(process.cwd() + path))).toString('utf-8')
            );
        } catch (error) {
            console.log(error)
            Logger.Log(`file is not found in path:'${path}'`, 'error');
            return {};
        }
    }

    public static getResponse(status: boolean, message: string, data: any, statusCode: number, statusNumber: number = 1000) {
        return {
            status_code: statusCode,
            body: {
                status: status,
                // statusNumber: statusNumber,
                message: message,
                data: data
            }
        };
    }

    public static async sendMessage(to: any) {
        const conf: any = await Utils.LoadEnv();
        const { accountSid, authToken, from } = conf.TWILIO

        const client = new Twilio(accountSid, authToken);

        client.messages.create({
            from: from,
            to,
            body: "You just sent an SMS from TypeScript using Twilio!",
        }).then((response) => {
            console.log("Message delivered : ", response)
        }).catch((error) => {
            console.log("Error Sending messsage: ", error)
        })
    }

    public static async generateUniqueFiveDigitNumber() {
         let donations = await this.donationsModel.findAllByQuery({})
        console.log(donations,"donations")
        let generatedNumbers : any = donations.map((item:any)=>item.donation_number)
        console.log(generatedNumbers,"generatedNumbers")
        let uniqueNum;
        do {
            uniqueNum = Math.floor(10000 + Math.random() * 90000);
        } while (generatedNumbers?.includes(uniqueNum));
        return uniqueNum?.toString();
    }
}
