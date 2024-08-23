import { BaseController } from "../../controllers/api/baseController";
import { AuthService } from "./authService";
import UserRoles from "../../utils/enums/userRoles";
import {ObjectId} from "mongodb";
import {DEFAULT_ORDER, DESC} from "../../utils/constants";
import {Utils} from "../../utils/utils";



export class AuthController extends BaseController {
    private authService: AuthService
    constructor() {
        const authService = new AuthService()
        super(authService);
        this.authService = authService
    }

    async getAll(req: any, res: any) {
        try {
            let param = req.query
            let filter :any ={}
            let orConditions = [];
            let order: any = DEFAULT_ORDER;

            // if(req.auth.role == UserRoles.USER){
            //     filter.user_id= new ObjectId(req.auth._id)
            // }

            if(req.auth.role == UserRoles.ADMIN){
                if(param.user_id !== undefined){
                    filter.user_id= new ObjectId(param.user_id)
                }

            }



            if (param.fullName !== undefined) {
                const escapedTitle = param.fullName.replace(/[.*+\-?^${}()|[\]\\]/g, '\\$&');
                filter.fullName = { $regex: new RegExp(`^${escapedTitle}`, 'i') };
            }
            if (param.email !== undefined) {
                filter.email = { $regex: new RegExp(param.email, 'i') }; // 'i' for case-insensitive
            }



            // Check if `keyword` is provided for email and fullname
            if (param.keyword) {
                const keywordRegex = { $regex: new RegExp(param.keyword, 'i') }; // 'i' for case-insensitive
                orConditions.push({ email: keywordRegex });
                orConditions.push({ fullName: keywordRegex });
            }

            // If there are any `$or` conditions, add them to the filter
            if (orConditions.length > 0) {
                filter.$or = orConditions;
            }
            if(param.isVerified) {
                filter.isVerified = param.isVerified == 1 ? true : false
            }

            if(param.role) {
                filter.role = parseInt(param.role)
            }
            if(param.gender) {
                filter.gender = param.gender
            }
            if(param.status) {
                filter.status = param.status == 1 ? true : false
            }
            if (param.order_by) {
                order = { [param.order_by]: parseInt(param?.order) || DESC }
            }

            const result = await this.service.getAll(order, param, filter);
            return res.status(result.status_code).send(result.body);
        } catch (error) {
            console.log(error, 'getAll');
            const error_result = Utils.getResponse(false, "Something went wrong", error, 500, 1005);
            return res.status(error_result.status_code).send(error_result.body);
        }
    };

    async getById(req: any, res: any) {
        return super.getById(req, res);
    };

    async create(req: any, res: any) {
        return super.create(req, res)
    };

    async update(req: any, res: any) {
        return super.update(req, res)
    };

    async delete(req: any, res: any) {
        return super.delete(req, res)
    };

    async signup(req: any, res: any) {
        return this.authService.signup(req, res)
    };

    async login(req: any, res: any) {
        return this.authService.login(req, res)
    };

    async socialLogin(req: any, res: any) {
        return this.authService.socialLogin(req, res)
    };

    async resendOtp(req: any, res: any) {
        return this.authService.resendOtp(req, res)
    };

    async sendForgotPasswordOTP(req: any, res: any) {
        return this.authService.sendForgotPasswordOTP(req, res)
    };

    async verifyOtp(req: any, res: any) {
        return this.authService.verifyOtp(req, res)
    };

    async resetPassword(req: any, res: any) {
        return this.authService.resetPassword(req, res)
    };

    async verifyUser(req: any, res: any) {
        return this.authService.verifyUser(req, res)
    };

    async logout(req: any, res: any) {
        return this.authService.logout(req, res)
    };

    async changePassword(req: any, res: any) {
        return this.authService.changePassword(req, res)
    };

    async getUserProfileById(req: any, res: any) {
        return this.authService.getUserProfileByID(req, res)
    };

    async getUserProfile(req: any, res: any) {
        return this.authService.getUserProfile(req, res)
    };

    async deleteAccount(req: any, res: any) {
        return this.authService.deleteAccount(req, res)
    };

    async deleteUser(req: any, res: any) {
        return this.authService.deleteUser(req, res)
    };

    async createUser(req: any, res: any) {
        return this.authService.createUser(req, res)
    };

    async updateUser(req: any, res: any) {
        return this.authService.updateUser(req, res)
    };

    async updateProfile(req: any, res: any) {
        return this.authService.updateProfile(req, res)
    };

    async sendForgotPasswordSecurity(req: any, res: any) {
        return this.authService.sendForgotPasswordSecurity(req, res)
    };

}