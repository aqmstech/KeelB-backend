import express from "express";
import { AdminAuthMiddleware } from '../../middlewares/api/auth';

const routes = express.Router();
import { AuthController } from "./authController";
import {
    loginValidator,
    signupValidator,
    sendOtpValidator,
    verifyOtpValidator,
    resetPasswordValidator,
    changePasswordValidator,
    sendForgotPasswordSecurityValidator,
    socialLoginValidator, addAuthValidator, updateAuthValidator
} from "./authValidator";

import { validateRequestBody } from "../../utils/validator/ValidateRequest";
import requireUser from "../../controllers/global/requiredUser";

routes.post('/signup', validateRequestBody(signupValidator), (req: any, res: any) => {
    const authController = new AuthController();
    authController.signup(req, res)
});

routes.post('/login', validateRequestBody(loginValidator), (req: any, res: any) => {
    const authController = new AuthController();
    authController.login(req, res)
});

routes.post('/social-login', validateRequestBody(socialLoginValidator),(req: any, res: any) => {
    const authController = new AuthController();
    authController.socialLogin(req, res)
});

routes.post('/resend-otp', validateRequestBody(sendOtpValidator), (req: any, res: any) => {
    const authController = new AuthController();
    authController.resendOtp(req, res)
});

routes.post('/forgot-password', validateRequestBody(sendOtpValidator), (req: any, res: any) => {
    const authController = new AuthController();
    authController.sendForgotPasswordOTP(req, res)
});

routes.post('/forgot-password-security', validateRequestBody(sendForgotPasswordSecurityValidator), (req: any, res: any) => {
    const authController = new AuthController();
    authController.sendForgotPasswordSecurity(req, res)
});

routes.post('/verify-otp', validateRequestBody(verifyOtpValidator), (req: any, res: any) => {
    const authController = new AuthController();
    authController.verifyOtp(req, res)
});

routes.patch('/reset-password', validateRequestBody(resetPasswordValidator), (req: any, res: any) => {
    const authController = new AuthController();
    authController.resetPassword(req, res)
});

routes.post('/verify-account', validateRequestBody(verifyOtpValidator), (req: any, res: any) => {
    const authController = new AuthController();
    authController.verifyUser(req, res)
});

routes.post('/logout', requireUser, (req: any, res: any) => {
    const authController = new AuthController();
    authController.logout(req, res)
});

routes.patch('/change-password', requireUser, validateRequestBody(changePasswordValidator), (req: any, res: any) => {
    const authController = new AuthController();
    authController.changePassword(req, res)
});

// user related apis
routes.get('/user-profile/:id', requireUser, (req: any, res: any) => {
    const authController = new AuthController();
    authController.getUserProfileById(req, res)
});

routes.get('/get-profile', requireUser, (req: any, res: any) => {
    const authController = new AuthController();
    authController.getUserProfile(req, res)
});

 
routes.get('/user-list', requireUser, (req: any, res: any) => {
    const authController = new AuthController();
    authController.getAll(req, res)
});

routes.post('/user', requireUser,validateRequestBody(addAuthValidator), (req: any, res: any) => {
    const authController = new AuthController();
    authController.createUser(req, res)
});

routes.patch('/user/:id', requireUser,validateRequestBody(updateAuthValidator), (req: any, res: any) => {
    const authController = new AuthController();
    authController.updateUser(req, res)
});

routes.patch('/user/delete/:id', requireUser, (req: any, res: any) => {
    const authController = new AuthController();
    authController.deleteUser(req, res)
});

routes.patch('/delete-user', requireUser, (req: any, res: any) => {
    const authController = new AuthController();
    authController.deleteAccount(req, res)
});

routes.patch('/update-profile', requireUser, (req: any, res: any) => {
    const authController = new AuthController();
    authController.updateProfile(req, res)
});


export const router = routes;