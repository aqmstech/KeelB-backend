import {BaseController} from "../../controllers/api/baseController";
import { ContactUsService} from "./contactusService";
import {DEFAULT_ORDER, DESC} from "../../utils/constants";
import UserRoles from "../../utils/enums/userRoles";
import {ObjectId} from "mongodb";
import {Utils} from "../../utils/utils";

export class ContactUsController extends BaseController {
    constructor() {
        const contactusService = new ContactUsService()
        super( contactusService );
    }

    // async getAll(req: any, res: any) {
    //     return super.getAll(req, res, req.query, req.params.filter || {});
    // };
    async getAll(req: any, res: any) {
        try {
            let order: any = DEFAULT_ORDER;
            let param = req.query
            let filter:any = {}
            let orConditions = [];

            if (param.phone !== undefined) {
                filter.phone = param.phone;
            }

            if (param.name !== undefined) {
                const escapedTitle = param.name.replace(/[.*+\-?^${}()|[\]\\]/g, '\\$&');
                filter.name = { $regex: new RegExp(`^${escapedTitle}`, 'i') };
            }
            if (param.keyword) {
                const keywordRegex = { $regex: new RegExp(param.keyword, 'i') }; // 'i' for case-insensitive
                orConditions.push({ name: keywordRegex });
                orConditions.push({ email: keywordRegex });
                orConditions.push({ message: keywordRegex });
                orConditions.push({ phone: keywordRegex });
            }

            // If there are any `$or` conditions, add them to the filter
            if (orConditions.length > 0) {
                filter.$or = orConditions;
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
}