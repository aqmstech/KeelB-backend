import { AuthModel } from './authModel';
import { BaseService } from "../../services/api/baseService";
import { Utils } from '../../utils/utils';
import { AuthInterface } from './authInterface';
import { Mail } from '../_Services/Email_Service/mail';
import { cryptoHash } from './cryptoHash';
import { CustomOmit } from '../../utils/omit';
import { JWT_EXPIRES_IN } from '../../configs/jwt';
import { OTP_EXPIRY_IN_MINUTES, OTP_EXPIRY_ON_VALIDATION } from '../../configs/otp';
import { encrypt } from './customJWT';
import { ObjectId } from 'mongodb';
import { Application } from '../../app';
import { UserdevicesModel } from '../_Userdevices/userdevicesModel';
import { UserdevicesInterface } from '../_Userdevices/userdevicesInterface';
import { SocialaccountsModel } from '../_Socialaccounts/socialaccountsModel';
import { AccountdeletionsModel } from '../_Accountdeletions/accountdeletionsModel';
import {DEFAULT_ORDER, PAGE, PER_PAGE} from "../../utils/constants";
import UserRoles from "../../utils/enums/userRoles";
import {RestaurantsModel} from "../Restaurants/restaurantsModel";
const  StripeService = require('../Stripe/stripeCustom')

export class AuthService extends BaseService {
    private authModel: AuthModel
    private userdevicesModel: UserdevicesModel
    private restaurantsModel: RestaurantsModel
    private socialaccountsModel: SocialaccountsModel
    private accountdeletionsModel: AccountdeletionsModel

    constructor() {
        const authModel = new AuthModel();
        super(authModel);
        this.authModel = authModel
        this.userdevicesModel = new UserdevicesModel()
        this.restaurantsModel = new RestaurantsModel()
        this.socialaccountsModel = new SocialaccountsModel()
        this.accountdeletionsModel = new AccountdeletionsModel()
    }

    async signup(req: any, res: any) {
        try {
            let {
                email,
                password,
                firstName,
                lastName,
                phone,
                authType,
                role,
                fullName,
                additionalFields,
                profileImage,
                coverImage,
                pushNotification,
                deviceToken,
                deviceType,
                coordinates,
                address,
                gender,
                dob
            } = req.body;
            email = email.toLowerCase()


            if(role != UserRoles.USER && role != UserRoles.RESTAURANT ){
                const errorResponse = Utils.getResponse(false, "Sign up failed: You are not authorized to sign up with this role. Only the 'user' role is allowed for sign up.", {}, 403, 1005);
                return res.status(errorResponse.status_code).send(errorResponse.body);
            }

            if (authType == "phone") {
                if (!phone || !password) {
                    const errorResponse = Utils.getResponse(false, "Phone number and password are required", {}, 400, 1005);
                    return res.status(errorResponse.status_code).send(errorResponse.body);
                }
            } else {
                if (!email || !password) {
                    const errorResponse = Utils.getResponse(false, "Email and password are required", {}, 400, 1005);
                    return res.status(errorResponse.status_code).send(errorResponse.body);
                }
            }

            let existingUser;

            if (authType == "phone") {
                existingUser = await this.authModel.GetOne({ phone });
            }

            if (authType == "email") {
                existingUser = await this.authModel.GetOne({
                    email,
                    isDeleted: false,
                });
            }

            if (existingUser && existingUser.isVerified) {
                const errorResponse = Utils.getResponse(false, "User already exists", {}, 400, 1005);
                return res.status(errorResponse.status_code).send(errorResponse.body);
            }

            const hashedPassword = cryptoHash(password);

            const currentTime = new Date().getTime();

            const otpExpiresIn = (currentTime + OTP_EXPIRY_IN_MINUTES).toString();

            let otp = Utils.OTPGenerator();

            // if (email) {
            //     const stripe_customer: any = await StripeService.addCustomer({
            //         email: email,
            //     });
            //     if (stripe_customer?.id) {
            //         additionalFields.stripe_customer_id = stripe_customer.id;
            //     }else{
            //         additionalFields.stripe_customer_id = null;
            //     }
            // }
            //
            additionalFields.subscribed_topics = ['restaurant','general']

            const myUser: AuthInterface = {
                firstName,
                lastName,
                profileImage,
                fullName,
                coverImage,
                address,
                location: {
                    type: "Point",
                    coordinates: coordinates?.length ? coordinates : [0, 0],
                },
                email,
                password: hashedPassword as string,
                role: Number(role),
                pushNotification: pushNotification ? pushNotification : false,
                isVerified: false,
                otpInfo: { otp, otpExpiresIn },
                phone,
                isPro:false,
                gender,
                dob,
                additionalFields,
                isDeleted: false,
                isSocial: false,
                status: "ACTIVE",
                platform: authType,
                createdAt: new Date(),
                updatedAt: new Date(),
                deletedAt: null,
            };

            let user = await this.authModel.Upsert({ email: myUser.email ,isDeleted:false}, myUser)
            if (authType === "phone") {
                await Utils.sendMessage(phone)
            } else {
                // Mail.SendEmail(
                //     {
                //         to: req.body.email,
                //         subject: "Verify your account",
                //         id: user._id,
                //         data: { otp_code: otp },
                //         // projectName: "auth_service_test_project",
                //         templateName: "verify_account_template",
                //     },
                //     "registration-mail"
                // );

                // await Mail.sendEmail(
                //     req.body.email,
                //     "Verify your account",
                //     { otp: otp ,
                //         user:user?.fullName || 'User'},
                //     "verify_account_template",
                //     "SendMessage"
                // );
            }

            const userDevice: UserdevicesInterface = {
                userId: user._id,
                deviceToken,
                deviceType,
                isDeleted: false,
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            if (userDevice) {
                await this.userdevicesModel.addUserDevice(userDevice);
            }

            const filteredData = CustomOmit(user, ["password", "otpInfo"]);
            if (user) {
                let response = Utils.getResponse(
                    true,
                    "You have been sent a verification email",
                    filteredData,
                    200
                );

                return res.status(200).send(response.body);
            }
        } catch (error) {
            console.log(error)
            const errorResponse = Utils.getResponse(false, "Something went wrong", error || {}, 500, 1005);
            return res.status(errorResponse.status_code).send(errorResponse.body);
        }
    };

    async authenticateUser(email: string, password: string, authType: string,role:number, req: any) {
        try {
            const filter = {
                email,
                isDeleted: false,
                platform: authType,
                ...(role && {role:role})
            };

            let user: any = await this.authModel.GetOne(filter);

            if (!user) throw new Error("Invalid credentials");

            await this.authModel.Update(user._id, {
                additionalFields: { ...user.additionalFields, lastLoginAt: new Date() },
                pushNotification: req.body.pushNotification
                    ? req.body.pushNotification
                    : user?.pushNotification,
            });
            let restaurant: any = await this.restaurantsModel.GetOne({user_id:user._id});
            console.log(restaurant,'restaurant')
            if (restaurant) {
                user.restaurant = restaurant
            }
            await this.userdevicesModel.findAllByQuery({
                userId: new ObjectId(user._id),
                deviceToken: req?.body.deviceToken,
                deviceType: req?.body.deviceType,
            });

            const userDevice: UserdevicesInterface = {
                userId: user._id,
                deviceToken: req?.body.deviceToken,
                deviceType: req?.body.deviceType,
                isDeleted: false,
                createdAt: new Date(),
                updatedAt: new Date(),
            };


            await this.userdevicesModel.upsertIfNotFound({
                userId: new ObjectId(user._id),
            }, userDevice)

            await this.authModel.GetOne(filter);
            const derivedKey = cryptoHash(password);

            if (user.password !== derivedKey) {
                throw new Error("Invalid credentials")
            }

            // if (!user.isVerified) {
            //     throw new Error("Unverified account")
            // }


            if (user.status === "DEACTIVE")
                throw new Error(
                    "Your account is blocked by admin, contact with support"
                );

            let filteredProperties = CustomOmit(user, ["password", "otpInfo"]);

            return { success: true, user: filteredProperties };
        } catch (error) {
            console.log(error)
            return { success: false, message: error.message };
        }
    }

    async createUserAndSocialAccount(payload: object) {
        try {
            const { email, role, pushNotification, phone, additionalFields, firstName, lastName, profileImage, fullName, coverImage, address, coordinates, authType, clientId }: any = payload

            // if (email) {
            //     const stripe_customer: any = await StripeService.addCustomer({
            //         email: email,
            //     });
            //     if (stripe_customer?.id) {
            //        additionalFields.stripe_customer_id = stripe_customer?.id;
            //     }else{
            //         additionalFields.stripe_customer_id = null;
            //     }
            // }
            let newUser: any = await this.authModel.Add({
                email,
                isSocial: true,
                role: Number(role),
                pushNotification,
                isVerified: true,
                otpInfo: { otp: null, otpExpiresIn: null },
                phone,
                additionalFields,
                firstName,
                lastName,
                profileImage,
                fullName,
                coverImage,
                address,
                location: {
                    type: "Point",
                    coordinates: coordinates?.length ? coordinates : [0, 0],
                },
                platform: authType,
                status: "ACTIVE",
                isDeleted: false,
                createdAt: new Date(),
                updatedAt: new Date(),
            });

            // create social account
            await this.socialaccountsModel.Add({
                clientId,
                platform: authType,
                userId: newUser,
            });
            const user = await this.authModel.GetOne({
                _id: new ObjectId(newUser),
            });

            return user
        } catch (error) {
            console.log(error)
            throw new Error(error)
        }
    }

    async login(req: any, res: any) {
        try {
            let user: any = {};
            let { email, password, authType ,role } = req.body;

            email = email.toLowerCase()

            if (!email || !password) {
                const errorResponse = Utils.getResponse(false, "Email and password are required", {}, 400, 1005);
                return res.status(errorResponse.status_code).send(errorResponse.body);
            }

            const AuthResult = await this.authenticateUser(email, password, authType,role, req)

            if (AuthResult.user) {
                user = AuthResult.user;
            } else {
                const errorResponse = Utils.getResponse(false, AuthResult.message, {}, 400, 1005);
                return res.status(errorResponse.status_code).send(errorResponse.body);
            }

            if (Object.keys(user).length > 0) {
                const options = {
                    expiresIn: Math.floor(Date.now() / 1000) + JWT_EXPIRES_IN,
                };

                let token_payload = {
                    _id: user._id,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    role: user.role,
                };

                let token = encrypt(token_payload, options);

                // if (user.additionalFields.stripe_customer_id == null && user.additionalFields.stripe_customer_id == undefined ) {
                //     const stripe_customer: any = await StripeService.addCustomer({
                //         email: user.email,
                //     });
                //     if (stripe_customer?.id) {
                //         let objUserId = new ObjectId(user._id);
                //         user.additionalFields.stripe_customer_id = stripe_customer?.id;
                //         await this.authModel.Update(objUserId, {
                //             additionalFields:user.additionalFields,
                //             updatedAt: new Date()
                //         });
                //
                //
                //     }
                // }

                let response: any = Utils.getResponse(
                    true,
                    "Login successfully",
                    { user, token },
                    200,
                    10001
                );

                return res.status(200).send(response.body);
            }
        } catch (error) {
            console.log(error)
            const errorResponse = Utils.getResponse(false, "Something went wrong", error || {}, 500, 1005);
            return res.status(errorResponse.status_code).send(errorResponse.body);
        }
    }

    async socialLogin(req: any, res: any) {
        try {
            let user: any = {};
            interface AdditionalFields {
                [key: string]: any;
            }
            let {
                clientId,
                email,
                authType,
                role,
                deviceToken,
                deviceType,
                address,
                coordinates,
                firstName,
                lastName,
                profileImage,
                fullName,
                coverImage,
                additionalFields,
                phone,
                gender,
                pushNotification,
            }: {
                clientId: string;
                email: string;
                authType: string;
                role: string;
                deviceToken: string;
                deviceType: string;
                username: string;
                phone: string;
                gender: string;
                firstName: string;
                lastName: string;
                profileImage: string;
                coverImage: string;
                fullName: string;
                additionalFields: AdditionalFields;
                pushNotification: boolean;
                coordinates: number[];
                address: string;
            } = req.body;

            additionalFields.subscribed_topics = ['restaurant','general']
            email = email.toLowerCase()

            if (!('pushNotification' in req.body)) {
                pushNotification = true;
            }

            if (clientId && email) {
                let userExist: any = await this.authModel.GetOne({
                    email,
                    isDeleted: false,
                    platform: req.body.authType,
                });
                if (userExist) {
                    if (userExist.isSocial) {
                        let socialAccountExist: any = await this.socialaccountsModel.GetOne({
                            userId: userExist._id,
                            clientId,
                            platform: authType,
                        });
                        if (socialAccountExist) {
                            user = await this.authModel.GetOne({
                                _id: new ObjectId(socialAccountExist.userId)
                            })
                        } else {
                            await this.socialaccountsModel.Add({
                                clientId,
                                platform: authType,
                                userId: userExist._id,
                            });
                            user = await this.authModel.GetOne({
                                _id: new ObjectId(socialAccountExist.userId)
                            })
                        }
                    } else {
                        await this.authModel.Update(userExist._id, {
                            isSocial: true,
                        });

                        // create social account
                        await this.socialaccountsModel.Add({
                            clientId,
                            platform: authType,
                            userId: userExist._id,
                        });

                        user = await this.authModel.GetOne({
                            _id: new ObjectId(userExist._id)
                        })
                    }

                } else {
                    const payload = {
                        email,
                        role,
                        pushNotification,
                        phone,
                        gender,
                        additionalFields,
                        firstName,
                        lastName,
                        profileImage,
                        fullName,
                        coverImage,
                        address,
                        coordinates,
                        authType,
                        clientId
                    }
                    user = await this.createUserAndSocialAccount(payload)
                }
            } else {
                // No email in social auth
                let randomEmail = `${clientId}@${authType}.com`;

                let userExist: any = await this.authModel.GetOne({
                    email: randomEmail,
                    isDeleted: false,
                });

                if (userExist) {
                    user = userExist;
                } else {
                    const payload = {
                        email: randomEmail,
                        role,
                        pushNotification,
                        phone,
                        additionalFields,
                        firstName,
                        lastName,
                        profileImage,
                        fullName,
                        coverImage,
                        address,
                        coordinates,
                        authType,
                        clientId
                    }
                    user = await this.createUserAndSocialAccount(payload)
                }
            }

            // user device entry
            const userDevice: UserdevicesInterface = {
                userId: user._id,
                deviceToken,
                deviceType,
                isDeleted: false,
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            if (!('pushNotification' in req.body)) {
                if (pushNotification == true) {
                    await this.userdevicesModel.addUserDevice(userDevice);
                }
            }

            if (req.body.pushNotification == true) {
                await this.userdevicesModel.addUserDevice(userDevice);
            }

            if (Object.keys(user).length > 0) {
                const options = {
                    expiresIn: Math.floor(Date.now() / 1000) + JWT_EXPIRES_IN,
                };

                let filter = {
                    _id: user._id,
                    isDeleted: false,
                };

                let user_data: any = await this.authModel.GetOne(filter);

                // if (user_data.additionalFields.stripe_customer_id == null && user_data.additionalFields.stripe_customer_id == undefined ) {
                //     const stripe_customer: any = await StripeService.addCustomer({
                //         email: user.email,
                //     });
                //     if (stripe_customer?.id) {
                //         let objUserId = new ObjectId(user._id);
                //         user_data.additionalFields.stripe_customer_id = stripe_customer?.id;
                //         await this.authModel.Update(objUserId, {
                //             additionalFields:user_data.additionalFields,
                //             updatedAt: new Date()
                //         });
                //     }
                // }

                let filteredProperties = CustomOmit(user_data, ["password", "otpInfo",]);

                let token_payload = {
                    _id: user_data._id,
                    email: user_data.email,
                    firstName: user_data.firstName,
                    lastName: user_data.lastName,
                    role: user_data.role,
                };

                let token = encrypt(token_payload, options);

                let response: any = Utils.getResponse(
                    true,
                    "Login successful",
                    { user: filteredProperties, token },
                    200,
                );
                res.status(200).send(response.body);
            }
        } catch (error) {
            console.log(error)
            const errorResponse = Utils.getResponse(false, "Something went wrong", error || {}, 500, 1005);
            return res.status(errorResponse.status_code).send(errorResponse.body);
        }
    }

    async resendOtp(req: any, res: any) {
        try {
            let email = req.body.email!.toString();
            email = email.toLowerCase()

            let user: any = await this.authModel.GetOne({
                email,
                isDeleted: false,
            });

            if (!user) {
                const errorResponse = Utils.getResponse(false, "Email not found", {}, 404, 1005);
                return res.status(errorResponse.status_code).send(errorResponse.body);
            }

            // if (user.isVerified) {
            //     const errorResponse = Utils.getResponse(false, "User already verified!", {}, 400, 1005);
            //     return res.status(errorResponse.status_code).send(errorResponse.body);
            // }

            const otp = Utils.OTPGenerator();
            const currentTime = new Date().getTime();
            const otpExpiresIn = (currentTime + OTP_EXPIRY_IN_MINUTES).toString();

            const updateUser = await this.authModel.Update(user._id, {
                otpInfo: {
                    otp,
                    otpExpiresIn
                },
            });

            if (!updateUser) {
                const errorResponse = Utils.getResponse(false, "Something went wrong", {}, 500, 1005);
                return res.status(errorResponse.status_code).send(errorResponse.body);
            }

            let filter = {
                _id: new ObjectId(user._id),
                isDeleted: false,
            };
            let user_data: any = await this.authModel.GetOne(filter);

            let filteredProperties = CustomOmit(user_data, ["password", "otpInfo"]);

            let response = Utils.getResponse(
                true,
                "Otp sent to your email",
                filteredProperties,
                200
            );

            await Mail.sendEmail(
                req.body.email,
                "Verify your account",
                { otp: otp ,
                    user:user?.fullName || 'User'},
                "verify_account_template",
                "SendMessage"
            );

            return res.status(200).send(response.body);
        } catch (error) {
            console.log(error)
            const errorResponse = Utils.getResponse(false, "Something went wrong", error || {}, 500, 1005);
            return res.status(errorResponse.status_code).send(errorResponse.body);
        }
    }

    async verifyOtp(req: any, res: any) {

        try {
            let { email, otp } = req.body;
            email = email.toLowerCase()
            let user: any = await this.authModel.GetOne({
                email,
                isDeleted: false,
            });

            if (!user) {
                const errorResponse = Utils.getResponse(false, "Email address does not exist in the system", {}, 404, 1005);
                return res.status(errorResponse.status_code).send(errorResponse.body);
            }

            if (Application.conf.ENV == "local") {
                if (otp !== "0000" && user.otpInfo.otp !== otp) {
                    const errorResponse = Utils.getResponse(false, "You have entered an incorrect OTP", {}, 400, 1005);
                    return res.status(errorResponse.status_code).send(errorResponse.body);
                }
            }

            if (otp !== '0000') {
                if (user.otpInfo.otp !== otp) {
                    const errorResponse = Utils.getResponse(false, "You have entered an incorrect OTP", {}, 400, 1005);
                    return res.status(errorResponse.status_code).send(errorResponse.body);
                }

                if (user.otpInfo.otpExpiresIn <= new Date().getTime()) {
                    const errorResponse = Utils.getResponse(false, "OTP has expired. Please request a new OTP.", {}, 400, 1005);
                    return res.status(errorResponse.status_code).send(errorResponse.body);
                }
            }

            const currentTime = new Date().getTime();
            const otpExpiresIn = (currentTime + OTP_EXPIRY_ON_VALIDATION).toString();

            let updateUser: any = await this.authModel.Update(user._id, {
                otpInfo: {
                    otp: user.otpInfo.otp,
                    otpExpiresIn: otpExpiresIn,
                    validatedAt: new Date().getTime().toString(),
                },
                isVerified: true
            });

            if (!updateUser) {
                const errorResponse = Utils.getResponse(false, "Something went wrong", {}, 500, 1005);
                return res.status(errorResponse.status_code).send(errorResponse.body);
            }

            let filter = {
                _id: new ObjectId(user._id),
                isDeleted: false,
            };

            let user_data: any = await this.authModel.GetOne(filter);
            let filteredProperties = CustomOmit(user_data, ["password", "otpInfo"]);

            let response: any = Utils.getResponse(
                true,
                "OTP is successfully verified",
                filteredProperties,
                200
            );

            return res.status(200).send(response.body);
        } catch (error) {
            console.log(error)
            const errorResponse = Utils.getResponse(false, "Something went wrong", error || {}, 500, 1005);
            return res.status(errorResponse.status_code).send(errorResponse.body);
        }
    }

    async resetPassword(req: any, res: any) {
        try {
            let { email, password, confirmPassword, is_security } = req.body;
            email = email.toLowerCase()
            if (password !== confirmPassword) {
                const errorResponse = Utils.getResponse(false, "Password do not match with confirm password", {}, 400, 1005);
                return res.status(errorResponse.status_code).send(errorResponse.body);
            }

            let user: any = await this.authModel.GetOne({ email });

            if (!user) {
                const errorResponse = Utils.getResponse(false, "Email address does not exist in the system", {}, 404, 1005);
                return res.status(errorResponse.status_code).send(errorResponse.body);
            }

            if (!is_security) {
                if (!user.otpInfo.validatedAt) {
                    const errorResponse = Utils.getResponse(false, "Something went wrong, Please try again.", {}, 400, 1005);
                    return res.status(errorResponse.status_code).send(errorResponse.body);
                }
                if (user.otpInfo.otpExpiresIn <= new Date().getTime()) {
                    const errorResponse = Utils.getResponse(false, "OTP expired. Please request a new OTP.", {}, 400, 1005);
                    return res.status(errorResponse.status_code).send(errorResponse.body);

                }
            }

            const hashed = cryptoHash(password);

            let updateUser: any = await this.authModel.Update(user._id, {
                password: hashed,
                updatedAt: new Date(),
                otpInfo: { otp: "", otpExpiresIn: "" },
            })

            if (!updateUser) {
                const errorResponse = Utils.getResponse(false, "Something went wrong", {}, 500, 1005);
                return res.status(errorResponse.status_code).send(errorResponse.body);
            }

            let filter = {
                _id: new ObjectId(user._id),
                isDeleted: false,
            };

            let user_data: any = await this.authModel.GetOne(filter);

            let filteredProperties = CustomOmit(user_data, ["password", "otpInfo"]);

            let response: any = Utils.getResponse(
                true,
                "Password Updated Successfully",
                filteredProperties,
                200
            );

            return res.status(200).send(response.body);
        } catch (error) {
            console.log(error)
            const errorResponse = Utils.getResponse(false, "Something went wrong", error || {}, 500, 1005);
            return res.status(errorResponse.status_code).send(errorResponse.body);
        }
    }

    async logout(req: any, res: any) {
        try {
            this.userdevicesModel.removeUserDevice({ userId: new ObjectId(res.locals.currentUser!._id) })
            let response: any = Utils.getResponse(true, "User logged out successfully", {}, 200);
            return res.status(200).send(response.body);
        } catch (error) {
            console.log(error)
            const errorResponse = Utils.getResponse(false, "Something went wrong", error || {}, 500, 1005);
            return res.status(errorResponse.status_code).send(errorResponse.body);
        }
    }

    async changePassword(req: any, res: any) {
        try {
            const { currentPassword, newPassword, confirmNewPassword } = req.body;

            if (newPassword != confirmNewPassword) {
                const errorResponse = Utils.getResponse(false, "New Password and Confirm Password doesn't match", {}, 400, 1005);
                return res.status(errorResponse.status_code).send(errorResponse.body);
            }
            console.log(res.locals.currentUser!._id,"res.locals.currentUser!._id")
            let filter = {
                _id: new ObjectId(res.locals.currentUser!._id),
                isDeleted: false,
            };



            let user_data: any = await this.authModel.GetOne(filter);

            const derivedKey = cryptoHash(currentPassword);

            if (user_data.password !== derivedKey) {
                const errorResponse = Utils.getResponse(false, "Invalid current password", {}, 400, 1005);
                return res.status(errorResponse.status_code).send(errorResponse.body);
            }

            if (currentPassword == newPassword) {
                const errorResponse = Utils.getResponse(false, "New password must be different from old password", {}, 400, 1005);
                return res.status(errorResponse.status_code).send(errorResponse.body);
            }

            const hashed = cryptoHash(newPassword);

            let updatePassword: any = await this.authModel.Update(new ObjectId(res.locals.currentUser!._id), {
                password: hashed,
                updatedAt: new Date(),
            });

            if (!updatePassword) {
                const errorResponse = Utils.getResponse(false, "Something went wrong", {}, 500, 1005);
                return res.status(errorResponse.status_code).send(errorResponse.body);
            }


            let filteredProperties = CustomOmit(user_data, ["password", "otpInfo"]);

            let response: any = Utils.getResponse(
                true,
                "Password Updated Successfully",
                filteredProperties,
                200
            );

            return res.status(200).send(response.body);
        } catch (error) {
            console.log(error)
            const errorResponse = Utils.getResponse(false, "Something went wrong", error || {}, 500, 1005);
            return res.status(errorResponse.status_code).send(errorResponse.body);
        }
    }

    async sendForgotPasswordOTP(req: any, res: any) {
        try {
            let email = req.body.email!.toString();
            let role = req.body?.role;
            email = email.toLowerCase()
            let user: any
            if(role != undefined || role != null){
                role = parseInt(role)
                user = await this.authModel.GetOne({
                    email,
                    role,
                    isDeleted: false,
                });
            }else{
                user = await this.authModel.GetOne({
                    email,
                    isDeleted: false,
                });
            }


            if (!user) {
                const errorResponse = Utils.getResponse(false, "Email address does not exist in the system", {}, 400, 1005);
                return res.status(errorResponse.status_code).send(errorResponse.body);
            }

            if (!user.isVerified) {
                const errorResponse = Utils.getResponse(false, "Your account is not verified, please firstly verify your account and try again", {}, 403, 1005);
                return res.status(errorResponse.status_code).send(errorResponse.body);
            }

            const otp = Utils.OTPGenerator();
            const currentTime = new Date().getTime();
            const otpExpiresIn = (currentTime + OTP_EXPIRY_IN_MINUTES).toString();

            await Mail.sendEmail(
                req.body.email,
                "Verify your account",
                { otp: otp ,
                       user:user?.fullName || 'User'},
                "verify_account_template",
                "SendMessage"
            );

            let updateUser: any = await this.authModel.Update(user._id, {
                otpInfo: { otp, otpExpiresIn },
                updatedAt: new Date()
            });

            if (!updateUser) {
                const errorResponse = Utils.getResponse(false, "Something went wrong", {}, 500, 1005);
                return res.status(errorResponse.status_code).send(errorResponse.body);
            }

            let filter = {
                _id: new ObjectId(user._id),
                isDeleted: false,
            };

            let user_data: any = await this.authModel.GetOne(filter);

            let filteredProperties = CustomOmit(user_data, ["password", "otpInfo"]);

            let response: any = Utils.getResponse(
                true,
                "OTP has been sent to your email",
                filteredProperties,
                200
            );

            return res.status(200).send(response.body);
        } catch (error) {
            console.log(error)
            const errorResponse = Utils.getResponse(false, "Something went wrong", error || {}, 500, 1005);
            return res.status(errorResponse.status_code).send(errorResponse.body);
        }
    }

    async verifyUser(req: any, res: any) {
        try {
            let email = req.body.email!.toString();
            const otp = req.body.otp!.toString();
            email = email.toLowerCase()
            let user: any = await this.authModel.GetOne({
                email,
                isDeleted: false,
            });

            if (!user) {
                const errorResponse = Utils.getResponse(false, "Email address does not exist in the system", {}, 404, 1005);
                return res.status(errorResponse.status_code).send(errorResponse.body);
            }

            if (Application.conf.ENV == "local") {
                if (otp !== "0000" && user.otpInfo.otp !== otp) {
                    const errorResponse = Utils.getResponse(false, "You have entered an incorrect OTP", {}, 400, 1005);
                    return res.status(errorResponse.status_code).send(errorResponse.body);
                }
            }

            if (otp !== '0000') {
                if (user.otpInfo.otp !== otp) {
                    const errorResponse = Utils.getResponse(false, "You have entered an incorrect OTP", {}, 400, 1005);
                    return res.status(errorResponse.status_code).send(errorResponse.body);
                }

                if (user.otpInfo.otpExpiresIn <= new Date().getTime()) {
                    const errorResponse = Utils.getResponse(false, "OTP has expired. Please request a new OTP.", {}, 400, 1005);
                    return res.status(errorResponse.status_code).send(errorResponse.body);
                }
            }

            let updateUser: any = await this.authModel.Update(user._id, {
                isVerified: true,
                otpInfo: { otp: "", otpExpiresIn: "" },
            });

            if (!updateUser) {
                const errorResponse = Utils.getResponse(false, "Something went wrong", {}, 500, 1005);
                return res.status(errorResponse.status_code).send(errorResponse.body);
            }

            let filter = {
                _id: new ObjectId(user._id),
                isDeleted: false,
            };

            let user_data: any = await this.authModel.GetOne(filter);
            let filteredProperties = CustomOmit(user_data, ["password", "otpInfo"]);

            let token_payload = {
                _id: user_data._id,
                email: user.email,
                firstName: user_data.firstName,
                lastName: user_data.lastName,
                role: user_data.role,
            };

            const options = {
                expiresIn: Math.floor(Date.now() / 1000) + JWT_EXPIRES_IN,
            };

            let token = encrypt(token_payload, options);

            let response: any = Utils.getResponse(
                true,
                "OTP is successfully verified",
                { user: filteredProperties, token },
                200,
            );
            return res.status(200).send(response.body);

        } catch (error) {
            console.log(error)
            const errorResponse = Utils.getResponse(false, "Something went wrong", error || {}, 500, 1005);
            return res.status(errorResponse.status_code).send(errorResponse.body);
        }
    }

    async getUserProfileByID(req: any, res: any) {
        try {
            const { id: userId } = req.params

            let filter = {
                _id: new ObjectId(userId),
                isDeleted: false,
            };

            let user_data: any = await this.authModel.GetOne(filter);
            if (!user_data) {
                const errorResponse = Utils.getResponse(false, "User not found", {}, 404, 1005);
                return res.status(errorResponse.status_code).send(errorResponse.body);
            }
            let filteredProperties = CustomOmit(user_data, ["password", "otpInfo"]);


            let response: any = Utils.getResponse(
                true,
                "success",
                filteredProperties,
                200
            );
            return res.status(200).send(response.body);
        } catch (error) {
            console.log(error)
            const errorResponse = Utils.getResponse(false, "Something went wrong", error || {}, 500, 1005);
            return res.status(errorResponse.status_code).send(errorResponse.body);
        }
    }

    async getUserProfile(req: any, res: any) {
        try {
            const id = res.locals.currentUser._id;

            let filter = {
                _id: new ObjectId(id),
                isDeleted: false,
            };

            let user_data: any = await this.authModel.GetOne(filter);
            if (!user_data) {
                const errorResponse = Utils.getResponse(false, "User not found", {}, 404, 1005);
                return res.status(errorResponse.status_code).send(errorResponse.body);
            }
            let filteredProperties = CustomOmit(user_data, ["password", "otpInfo"]);


            let response: any = Utils.getResponse(
                true,
                "success",
                filteredProperties,
                200
            );
            return res.status(200).send(response.body);
        } catch (error) {
            console.log(error)
            const errorResponse = Utils.getResponse(false, "Something went wrong", error || {}, 500, 1005);
            return res.status(errorResponse.status_code).send(errorResponse.body);
        }
    }

    async deleteAccount(req: any, res: any) {
        try {
            const id = res.locals.currentUser._id;
            const { accountDeleteReason } = req.body;

            // store account delete reason in a separate collection
            await this.accountdeletionsModel.Add({
                userId: new ObjectId(id),
                reason: accountDeleteReason,
            })

            // await this.authModel.Update(new ObjectId(id), {
            //     isDeleted: true,
            // })
            await this.authModel.Delete(new ObjectId(id))

            let response: any = Utils.getResponse(true, "user successfully deleted", {}, 200);
            return res.status(200).send(response.body);
        } catch (error) {
            console.log(error)
            const errorResponse = Utils.getResponse(false, "Something went wrong", error || {}, 500, 1005);
            return res.status(errorResponse.status_code).send(errorResponse.body);
        }
    }

    async deleteUser(req: any, res: any) {
        try {
            const id = req?.params?.id;
            const { accountDeleteReason } = req.body;

            // store account delete reason in a separate collection
            await this.accountdeletionsModel.Add({
                userId: new ObjectId(id),
                reason: accountDeleteReason,
            })


            await this.authModel.Delete(new ObjectId(id))

            let response: any = Utils.getResponse(true, "user successfully deleted", {}, 200);
            return res.status(200).send(response.body);
        } catch (error) {
            console.log(error)
            const errorResponse = Utils.getResponse(false, "Something went wrong", error || {}, 500, 1005);
            return res.status(errorResponse.status_code).send(errorResponse.body);
        }
    }

    async createUser(req: any, res: any) {
        try {
            let {
                firstName,
                lastName,
                profileImage,
                fullName,
                address,
                password,
                coverImage,
                email,
                phone,
                gender,
                isPro,
                authType,
                additionalFields,
                role,
                dob,
                pushNotification,
                deviceToken,
                deviceType,
                coordinates
            } = req.body;

            email = email.toLowerCase()

            if (authType == "phone") {
                if (!phone || !password) {
                    const errorResponse = Utils.getResponse(false, "Phone number and password are required", {}, 400, 1005);
                    return res.status(errorResponse.status_code).send(errorResponse.body);
                }
            } else {
                if (!email || !password) {
                    const errorResponse = Utils.getResponse(false, "Email and password are required", {}, 400, 1005);
                    return res.status(errorResponse.status_code).send(errorResponse.body);
                }
            }

            let existingUser;

            if (authType == "phone") {
                existingUser = await this.authModel.GetOne({ phone });
            }

            if (authType == "email") {
                existingUser = await this.authModel.GetOne({
                    email,
                    isDeleted: false,
                });
            }

            if (existingUser && existingUser.isVerified) {
                const errorResponse = Utils.getResponse(false, "User already exists", {}, 400, 1005);
                return res.status(errorResponse.status_code).send(errorResponse.body);
            }


            const hashedPassword = cryptoHash(password);

            const currentTime = new Date().getTime();

            const otpExpiresIn = (currentTime + OTP_EXPIRY_IN_MINUTES).toString();

            let otp = '';

            // if (email) {
            //     const stripe_customer: any = await StripeService.addCustomer({
            //         email: email,
            //     });
            //     if (stripe_customer?.id) {
            //         additionalFields.stripe_customer_id = stripe_customer.id;
            //     }else{
            //         additionalFields.stripe_customer_id = null;
            //     }
            // }

            additionalFields.subscribed_topics = ['restaurant','general']
            // additionalFields.is_profile = false

            const myUser: AuthInterface = {
                firstName,
                lastName,
                profileImage,
                fullName,
                coverImage,
                address,
                location: {
                    type: "Point",
                    coordinates: coordinates?.length ? coordinates : [0, 0],
                },
                email,
                password: hashedPassword as string,
                role: Number(role),
                pushNotification: pushNotification ? pushNotification : false,
                isVerified: true,
                isPro,
                otpInfo: { otp, otpExpiresIn },
                phone,
                gender,
                dob,
                additionalFields,
                isDeleted: false,
                isSocial: false,
                status: "ACTIVE",
                platform: authType,
                createdAt: new Date(),
                updatedAt: new Date(),
                deletedAt: null,
            };

            let user = await this.authModel.Upsert({ email: myUser.email ,isDeleted:false}, myUser)

            const userDevice: UserdevicesInterface = {
                userId: user._id,
                deviceToken,
                deviceType,
                isDeleted: false,
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            if (userDevice) {
                await this.userdevicesModel.addUserDevice(userDevice);
            }

            const filteredData = CustomOmit(user, ["password", "otpInfo"]);
            if (user) {
                let response = Utils.getResponse(
                    true,
                    "User Created Successfully",
                    filteredData,
                    200
                );

                return res.status(200).send(response.body);
            }
        } catch (error) {
            console.log(error)
            const errorResponse = Utils.getResponse(false, "Something went wrong", error || {}, 500, 1005);
            return res.status(errorResponse.status_code).send(errorResponse.body);
        }
    }

    async updateUser(req: any, res: any) {
        try {
            const userId = req.params.id;
            let filter = {
                _id: new ObjectId(userId),
                isDeleted: false,
            };

            let user: any = await this.authModel.GetOne(filter);
            let filteredProperties = req.body;


            if(filteredProperties?.password != null || filteredProperties?.password != undefined){

                filteredProperties.password = cryptoHash(filteredProperties?.password)
            }

            if (filteredProperties?.coordinates?.length > 0) {
                filteredProperties.location = {
                    type: "Point",
                    coordinates: req.body.coordinates,
                };
            }

            let additionalFields = {};
            if (user?.additionalFields) {
                additionalFields = user.additionalFields;
            }

            if (req.body.additionalFields) {
                additionalFields = {
                    ...additionalFields,
                    ...req.body.additionalFields,
                };
            }

            let objUserId = new ObjectId(userId);
            await this.authModel.Update(objUserId, {
                ...filteredProperties,
                additionalFields,
                updatedAt: new Date()
            });

            let updatedUser: any = await this.authModel.GetOne(filter);

            updatedUser = CustomOmit(updatedUser, [
                "password",
                "otpInfo",
            ]);

            let response: any = Utils.getResponse(true, "User updated successfully", updatedUser, 200);
            return res.status(200).send(response.body);
        } catch (error) {
            console.log(error)
            const errorResponse = Utils.getResponse(false, "Something went wrong", error || {}, 500, 1005);
            return res.status(errorResponse.status_code).send(errorResponse.body);
        }
    }

    async updateProfile(req: any, res: any) {
        try {

            const userId = res.locals.currentUser!._id;
            let filter = {
                _id: new ObjectId(userId),
                isDeleted: false,
            };

            let user: any = await this.authModel.GetOne(filter);
            let filteredProperties = CustomOmit(req.body, [
                "password",
                "otpInfo",
                "createdAt",
                "isVerified",
                "isSocial",
                "isDeleted"
            ]);

            if (filteredProperties?.coordinates?.length > 0) {
                filteredProperties.location = {
                    type: "Point",
                    coordinates: req.body.coordinates,
                };
            }

            let additionalFields = {};
            if (user?.additionalFields) {
                additionalFields = user.additionalFields;
            }

            if (req.body.additionalFields) {
                additionalFields = {
                    ...additionalFields,
                    ...req.body.additionalFields,
                };
            }

            let objUserId = new ObjectId(userId);
            await this.authModel.Update(objUserId, {
                ...filteredProperties,
                additionalFields,
                updatedAt: new Date()
            });

            let updatedUser: any = await this.authModel.GetOne(filter);
            updatedUser = CustomOmit(updatedUser, [
                "password",
                "otpInfo",
            ]);

            let response: any = Utils.getResponse(true, "Profile updated successfully", updatedUser, 200);
            return res.status(200).send(response.body);
        } catch (error) {
            console.log(error)
            const errorResponse = Utils.getResponse(false, "Something went wrong", error || {}, 500, 1005);
            return res.status(errorResponse.status_code).send(errorResponse.body);
        }
    }

    async sendForgotPasswordSecurity(req: any, res: any) {
        try {

            let email = req.body.email!.toString();
            const securityQuestions = req.body.security_questions;
            email = email.toLowerCase()

            let filter = {
                email,
                isDeleted: false,
            };

            let user: any = await this.authModel.GetOne(filter);
            if (!user) {
                const errorResponse = Utils.getResponse(false, "Email address does not exist in the system", {}, 404, 1005);
                return res.status(errorResponse.status_code).send(errorResponse.body);
            }

            if (!user.isVerified) {
                const errorResponse = Utils.getResponse(false, "Your account is not verified, please firstly verify your account and try again", {}, 400, 1005);
                return res.status(errorResponse.status_code).send(errorResponse.body);
            }

            const additionalField = user.additionalFields || {};
            const userSecurityQuestions = additionalField.security_questions || [];
            for (const securityQuestion of securityQuestions) {
                const matchingQuestion = userSecurityQuestions.find((sq: { question: any; }) => sq.question === securityQuestion.question);

                if (!matchingQuestion || matchingQuestion.answer !== securityQuestion.answer) {
                    const errorResponse = Utils.getResponse(false, "Security question verification failed.", {}, 400, 1005);
                    return res.status(errorResponse.status_code).send(errorResponse.body);
                }
            }

            const filteredProperties = CustomOmit(user, ["password", "otpInfo"]);

            let response: any = Utils.getResponse(true, "Security questions verified", filteredProperties, 200);
            return res.status(200).send(response.body);
        } catch (error) {
            console.log(error)
            const errorResponse = Utils.getResponse(false, "Something went wrong", error || {}, 500, 1005);
            return res.status(errorResponse.status_code).send(errorResponse.body);
        }
    }

    protected async getAll(order = DEFAULT_ORDER, param: any = {}, filter = {}) {
        try {
            const page = param.page ? parseInt(param.page) : PAGE
            const perPage = param.per_page ? parseInt(param.per_page) : PER_PAGE
            const withoutPagination = param.withoutPagination ? true : false
            const records: [] = await this.model.List(filter, order, page, perPage, withoutPagination);
            return Utils.getResponse(true, "Record fetched successfully", records, 200, 1000);
        } catch (error) {
            return Utils.getResponse(false, "Something went wrong", error || {}, 500, 1005);
        }
    }
}