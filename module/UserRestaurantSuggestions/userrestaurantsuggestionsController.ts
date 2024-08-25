import {BaseController} from "../../controllers/api/baseController";
import { UserRestaurantSuggestionsService} from "./userrestaurantsuggestionsService";
import {ObjectId} from "mongodb";
import {DEFAULT_ORDER, DESC} from "../../utils/constants";
import UserRoles from "../../utils/enums/userRoles";
import {Utils} from "../../utils/utils";

export class UserRestaurantSuggestionsController extends BaseController {
    constructor() {
        const userrestaurantsuggestionsService = new UserRestaurantSuggestionsService()
        super( userrestaurantsuggestionsService );
    }

    async getAll(req: any, res: any) {
        try {
            let param = req.query
            let filter :any ={}
            let orConditions = [];
            let order: any = DEFAULT_ORDER;



            // Check if `keyword` is provided for email and fullname
            if (param.keyword) {
                const keywordRegex = { $regex: new RegExp(param.keyword, 'i') }; // 'i' for case-insensitive
                orConditions.push({ name: keywordRegex });
                orConditions.push({ address: keywordRegex });
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
        req.body.user_id = new ObjectId(req?.auth?._id)
        return super.create(req, res)
    };

    async update(req: any, res: any) {
        return super.update(req, res)
    };

    async delete(req: any, res: any) {
        return super.delete(req, res)
    };
}