import {BaseController} from "../../controllers/api/baseController";
import { ReviewsService} from "./reviewsService";
import { ObjectId } from "mongodb";
import UserRoles from "../../utils/enums/userRoles";
import {DEFAULT_ORDER, DESC} from "../../utils/constants";
import {Utils} from "../../utils/utils";
import {RestaurantsModel} from "../Restaurants/restaurantsModel";
import {AuthService} from "../_Auth/authService";

export class ReviewsController extends BaseController {
    private restaurantsModel: RestaurantsModel
    constructor() {
        const reviewsService = new ReviewsService()
        super( reviewsService );
        this.restaurantsModel = new RestaurantsModel()
    }

    async getAll(req: any, res: any) {
        try {
            let param = req.query
            let filter :any ={}
            let orConditions = [];
            let order: any = DEFAULT_ORDER;

            if(param.user_id !== undefined){
                filter.user_id = new ObjectId(param.user_id)
            }

            if(req.auth.role === UserRoles.RESTAURANT){
                let user_restaurant = await this.restaurantsModel.GetOne({user_id:new ObjectId(req.auth._id),deletedAt:null})
                if(user_restaurant){
                    filter.restaurant_id = new ObjectId(user_restaurant._id)
                }

            }

            if(param.restaurant_id !== undefined){
                filter.restaurant_id = new ObjectId(param.restaurant_id)
            }
            if(req?.auth?.role == UserRoles.USER){
                filter.status =true
            }

            // Check if `keyword` is provided for email and fullname
            if (param.keyword) {
                const keywordRegex = { $regex: new RegExp(param.keyword, 'i') }; // 'i' for case-insensitive
                orConditions.push({ ['user.fullName']: keywordRegex });
                orConditions.push({ description: keywordRegex });
            }

            // If there are any `$or` conditions, add them to the filter
            if (orConditions.length > 0) {
                filter.$or = orConditions;
            }

            if (param.rating !== undefined) {
                filter.rating = {
                    $gte: parseInt(param.rating) - 0.4, // Minimum value (example: for 4, this is 3.6)
                    $lt: parseInt(param.rating) + 0.5  // Less than the given value + 0.05 (example: for 4, this is 4.05)
                };
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

        if(req?.body?.restaurant_id){
            req.body.restaurant_id = new ObjectId(req?.body?.restaurant_id)
        }
        if(req.auth.role === UserRoles.ADMIN || req.auth.role === UserRoles.SUB_ADMIN){
            req.body.user_id = new ObjectId(req.body.user_id)
        }else{
            req.body.user_id = new ObjectId(req?.auth?._id)
        }

        return super.create(req, res)
    };

    async update(req: any, res: any) {
        if(req?.body?.restaurant_id){
            req.body.restaurant_id = new ObjectId(req?.body?.restaurant_id)
        }
        req.body.user_id = new ObjectId(req.body.user_id)
        return super.update(req, res)
    };

    async delete(req: any, res: any) {
        return super.delete(req, res)
    };
}