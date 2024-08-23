import { AuthTypeEnum } from "./authInterface";

const Joi = require('joi');
const authType = {
  PHONE: 'phone',
  EMAIL: 'email'
}

export const addAuthValidator = Joi.object().keys(
  {
    firstName: Joi.string().min(2).max(255).optional(),
    lastName: Joi.string().min(2).max(255).optional(),
    profileImage: Joi.string().max(255),
    fullName: Joi.string().max(255).required(),
    coverImage: Joi.string().max(255),
    address: Joi.string().min(2).max(255).optional(),
    email: Joi.string().min(10).max(255).required(),
    password: Joi.string().min(2).max(255).optional(),
    role: Joi.number().required(),
    pushNotification: Joi.boolean(),
    isVerified: Joi.boolean(),
    location: Joi.any(),
    gender: Joi.string(),
    dob: Joi.string(),
    otpInfo: Joi.any(),
    phone: Joi.string().min(10).max(20).optional(),
    isDeleted: Joi.boolean(),
    isSocial: Joi.boolean(),
    status: Joi.string().min(2).max(20).optional()
  }
);

export const updateAuthValidator = Joi.object().keys(
  {
    firstName: Joi.string().min(2).max(255).optional(),
    lastName: Joi.string().min(2).max(255).optional(),
    profileImage: Joi.string().max(255),
    fullName: Joi.string().max(255).required(),
    email: Joi.forbidden(),
    coverImage: Joi.string().max(255),
    address: Joi.string().min(2).max(255).optional(),
    password: Joi.string().min(2).max(255).optional(),
    role: Joi.number().required(),
    pushNotification: Joi.boolean(),
    isVerified: Joi.boolean(),
    location: Joi.any(),
    otpInfo: Joi.any(),
      gender: Joi.string(),
      dob: Joi.string(),
    phone: Joi.string().min(10).max(20).optional(),
    isDeleted: Joi.boolean(),
    isSocial: Joi.boolean(),
    status: Joi.string().min(2).max(20).optional(),
  }
);

export const getAllAuthValidator = Joi.object().keys(
  {
    firstName: Joi.string().min(2).max(255),
    lastName: Joi.string().min(2).max(255),
    profileImage: Joi.string().max(255),
    fullName: Joi.string().max(255),
    coverImage: Joi.string().max(255),
    address: Joi.string().min(2).max(255),
    email: Joi.string().min(10).max(255),
    password: Joi.string().min(2).max(255),
    role: Joi.number(),
    pushNotification: Joi.boolean(),
    isVerified: Joi.boolean(),
    location: Joi.any(),
    otpInfo: Joi.any(),
    phone: Joi.string().min(10).max(20),
    isDeleted: Joi.boolean(),
    isSocial: Joi.boolean(),
    status: Joi.string().min(2).max(20),
    createdAt: Joi.date().max('10-30-2023').iso(),
    updatedAt: Joi.date(),
    keyword: Joi.any(),
    withoutPagination: Joi.any(),
    page: Joi.any(),
    per_page: Joi.any()
  }
);

export const loginValidator = Joi.object().keys(
  {
    email: Joi.string().email().min(10).max(255),
    password: Joi.string().min(2).max(255),
    authType: Joi.string().valid(authType.PHONE, authType.EMAIL).required().min(5).max(255),
    role: Joi.number().optional(),
    deviceType: Joi.string().min(2).max(255),
    deviceToken: Joi.string().min(2).max(255),
  }
);

export const signupValidator = Joi.object().keys(
  {
    // firstName: Joi.string().required().min(2).max(255),
    // lastName: Joi.string().required().min(2).max(255),
    email: Joi.string().email().required().min(10).max(255),
    // phone: Joi.string().min(2).max(255),
    password: Joi.string().required().min(2).max(255),
    authType: Joi.string().valid(authType.PHONE, authType.EMAIL).required().min(5).max(255),
    // role: Joi.number().required(),
    deviceType: Joi.string().min(2).max(255),
    deviceToken: Joi.string().min(2).max(255),
    // coordinates: Joi.array().min(2).required().max(2),
    // address: Joi.string().min(2).required().max(255),
  }
);

export const sendOtpValidator = Joi.object().keys(
  {
    email: Joi.string().email().required().min(10).max(255),
  }
);

export const verifyOtpValidator = Joi.object().keys(
  {
    email: Joi.string().email().required().min(10).max(255),
    otp: Joi.string().required().min(4).max(6),
  }
);

export const resetPasswordValidator = Joi.object().keys(
  {
    email: Joi.string().email().required().min(10).max(255),
    password: Joi.string().required().min(8).max(30),
    confirmPassword: Joi.string().required().min(8).max(30),
    is_security: Joi.boolean().required(),
  }
);

export const changePasswordValidator = Joi.object().keys(
  {
    currentPassword: Joi.string().required().min(8).max(30),
    newPassword: Joi.string().required().min(8).max(30),
    confirmNewPassword: Joi.string().required().min(8).max(30),
  }
);

export const sendForgotPasswordSecurityValidator = Joi.object().keys(
  {
    email: Joi.string().email().required().min(10).max(255),
    security_questions: Joi.array().items(
      Joi.object({
        question: Joi.string().required(),
        answer: Joi.string().required()
      })
    ).required().min(1)
  }
);

export const socialLoginValidator = Joi.object().keys(
  {
    authType: Joi.string().valid(...AuthTypeEnum).required()
      .messages({ 'any.only': `Auth type must be from ${AuthTypeEnum}` }),
    email: Joi.string().allow("").email(),
    phone: Joi.string().allow(""),
    role: Joi.number().required(),
    pushNotification: Joi.boolean().optional(),
    deviceType: Joi.when('pushNotification', {
      is: true,
      then: Joi.string().required(),
      otherwise: Joi.allow("")
    }),
    deviceToken: Joi.when('pushNotification', {
      is: true,
      then: Joi.string().required(),
      otherwise: Joi.allow("")
    }),
    coordinates: Joi.array().optional()
      .items(Joi.number()).min(2)
  }
);
