import { RMQ } from '../server/queues/rabbitmq';

export enum MailEvents {
  REGISTRATIONMAIL = 'registration-mail',
  FORGOTPASSWORD = 'forgot-pass',
}

interface SMTPMessageFormat {
  to: string;
  subject: string;
  [key: string]: any;
}

export abstract class Mail {
  public static async SendEmail(data: SMTPMessageFormat, message: string) {
    try {
      /* let validated!: ValidationError;
      console.log({message})
      console.log(data)
      switch (message) {
        case MailEvents.REGISTRATIONMAIL:
        case MailEvents.FORGOTPASSWORD:
          validated = JoiSchemas.RegistrationMailValidator(data);
          break;
        default:
          break;
      }
      console.log('Data = > ', data);
      if (!validated) throw new Error(`Validation Not Performed : ${message}\n ${JSON.stringify(data, undefined, 4)}`);
      if (validated.errored) throw new Error(`Invalid Schema For Sending Mail : ${message}\n ${JSON.stringify(validated, undefined, 4)}`);
      else */ await RMQ.PublishMessageConfirm('smtp', { msg: message, data: data });
    } catch (error) {
      throw error;
    }
  }
}
