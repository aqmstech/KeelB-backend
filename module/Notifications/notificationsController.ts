import {BaseController} from "../../controllers/api/baseController";
import { NotificationsService} from "./notificationsService";
import {DEFAULT_ORDER, DESC} from "../../utils/constants";
import {Utils} from "../../utils/utils";
import UserRoles from "../../utils/enums/userRoles";
import {ObjectId} from "mongodb";

export class NotificationsController extends BaseController {
    constructor() {
        const notificationsService = new NotificationsService()
        super( notificationsService );
    }

    async getAll(req: any, res: any) {
        try {
            let param = req.query
            let filter :any = {}
            let orConditions = [];
            let order: any = DEFAULT_ORDER;

            if(req.auth.role == UserRoles.USER){
                filter.receiver_id= new ObjectId(req.auth._id)
            }
            if(req.auth.role == UserRoles.ADMIN){
                   filter.type = UserRoles.ADMIN
                if(param.receiver_id !== undefined){
                    filter.receiver_id= new ObjectId(param.receiver_id)
                }
            }

            // Check if `keyword` is provided for email and fullname
            if (param.keyword) {
                const keywordRegex = { $regex: new RegExp(param.keyword, 'i') }; // 'i' for case-insensitive
                orConditions.push({ title: keywordRegex });
                orConditions.push({ body: keywordRegex });
            }

            // If there are any `$or` conditions, add them to the filter
            if (orConditions.length > 0) {
                filter.$or = orConditions;
            }

            if(param.is_read !== undefined){
               filter.is_read= param.is_read
            }

            if(param.status !== undefined){
                filter.status= param.status
            }

            if(param.topic !== undefined){
                filter.topic= param.topic
            }

            if(param.title !== undefined){
                filter.title= param.title
            }

            if(param.body !== undefined){
                filter.body= param.body
            }

            if(param.ref_id !== undefined){
                filter.ref_id= new ObjectId(param.ref_id)
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
        try {
            const result = await this.service.create(req);
            return res.status(result.status_code).send(result.body);
        } catch (error) {
            console.log(error, 'create');
            const error_result = Utils.getResponse(false, "Something went wrong", error, 500, 1005);
            return res.status(error_result.status_code).send(error_result.body);
        }
    };

    async update(req: any, res: any) {
        return super.update(req, res)
    };

    async markAllRead(req: any, res: any) {
        try {
            console.log('here')
            const id = new ObjectId(req.auth._id);
            const result = await this.service.markAllRead(id, {is_read:true,updatedAt:new Date()});
            return res.status(result.status_code).send(result.body);

        } catch (error) {
            console.log(error, 'update');
            const error_result = Utils.getResponse(false, "Something went wrong", error, 500, 1005);
            return res.status(error_result.status_code).send(error_result.body);
        }
    };

    async delete(req: any, res: any) {
        return super.delete(req, res)
    };
}