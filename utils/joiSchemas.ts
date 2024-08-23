import Joi from 'joi';

export interface ValidationError {
  errored: boolean;
  errors: string[] | null;
  value: any;
}

export abstract class JoiSchemas {

  public static SQSEventValidated(data: any) {

    let result = Joi.object({
      msg: Joi.string().required()
    }).options({ allowUnknown: true }).validate(data, { abortEarly: false });

    if (result.error)
      return {
        errored: true,
        errors: result.error.message.split('.'),
        value: result.value,
      };
    else return { errored: false, errors: null, value: result.value };

  }


  public static SignUpValidator(data: any): ValidationError {
    let schema = Joi.object({
      name: Joi.string().min(3).max(30).required(),
      password: Joi.string().required().min(8).max(50),
      dob: Joi.string()
        .required()
        .regex(/^\d{2}\/\d{2}\/\d{4}$/),
      email: Joi.string().email().required(),
      number: Joi.string()
        .required()
        .regex(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im),
      countryCode: Joi.string().required().min(2).max(4),
    });
    let result = schema.validate(data, { abortEarly: false });
    if (result.error)
      return {
        errored: true,
        errors: result.error.message.split('.'),
        value: result.value,
      };
    else return { errored: false, errors: null, value: result.value };
  }

  public static LoginValidator(data: any, key: string): ValidationError {
    let schema = Joi.object({
      [key]: Joi.string().required(),
      email: Joi.string().email().required(),
    });
    let result = schema.validate(data, { abortEarly: false });
    if (result.error)
      return {
        errored: true,
        errors: result.error.message.split('.'),
        value: result.value,
      };
    else return { errored: false, errors: null, value: result.value };
  }

  public static ChangePasswordValidator(data: any): ValidationError {
    let schema = Joi.object({
      token: Joi.string().required(),
      new_password: Joi.string().required(),
    });
    let result = schema.validate(data, { abortEarly: false });
    if (result.error)
      return {
        errored: true,
        errors: result.error.message.split('.'),
        value: result.value,
      };
    else return { errored: false, errors: null, value: result.value };
  }

  public static LoginValidatorMeta(data: any): ValidationError {
    let schema = Joi.object({
      metaAddress: Joi.string().required(),
    });

    let result = schema.validate(data, { abortEarly: false });

    if (result.error)
      return {
        errored: true,
        errors: result.error.message.split('.'),
        value: result.value,
      };
    else return { errored: false, errors: null, value: result.value };
  }

  public static RegistrationMailValidator(data: any): ValidationError {
    let schema = Joi.object({
      to: Joi.string().email().required(),
      subject: Joi.string().required(),
      id: Joi.string().required(),
    });

    let result = schema.validate(data, { abortEarly: false });
    if (result.error)
      return {
        errored: true,
        errors: result.error.message.split('.'),
        value: result.value,
      };
    else return { errored: false, errors: null, value: result.value };
  }

  public static SignupValidator(data: any): ValidationError {
    // let [dd, mm, yyyy] = data.date.split('/');
    // data.date = new Date(`${mm}/${dd}/${yyyy}`);

    let schema = Joi.object({
      username: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string().required().min(8).max(50),
    });

    let result = schema.validate(data, { abortEarly: false });

    if (result.error)
      return {
        errored: true,
        errors: result.error.message.split('.'),
        value: result.value,
      };
    else return { errored: false, errors: null, value: result.value };
  }

  public static OtpVerify(data: any): ValidationError {
    // let [dd, mm, yyyy] = data.date.split('/');
    // data.date = new Date(`${mm}/${dd}/${yyyy}`);

    let schema = Joi.object({
      email: Joi.string().email().required(),
      otp: Joi.string().required(),
    });

    let result = schema.validate(data, { abortEarly: false });

    if (result.error)
      return {
        errored: true,
        errors: result.error.message.split('.'),
        value: result.value,
      };
    else return { errored: false, errors: null, value: result.value };
  }

}
