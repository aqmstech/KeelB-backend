import * as NodeMailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import { Sentry } from "../../server/sentry";

export abstract class SMTP {

  public static async SendMail(email: string, subject: string, otp: any): Promise<SMTPTransport.SentMessageInfo | undefined> {

    try {

    } catch (error: any) {
      console.log("Error sending email ===> ", error)
      Sentry.Error(error, 'Error In Registering Forget Pass');
      /**
       * @TODO Preserve Failures into DB and re-send email when possible
       */
      return undefined;
    }

  }
}


