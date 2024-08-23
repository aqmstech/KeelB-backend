import {BaseController} from "../../controllers/api/baseController";
import { UserCardsService} from "./usercardsService";
import UserRoles from "../../utils/enums/userRoles";
import {ObjectId} from "mongodb";
import {DEFAULT_ORDER} from "../../utils/constants";
import {Utils} from "../../utils/utils";

export class UserCardsController extends BaseController {
    constructor() {
        const usercardsService = new UserCardsService()
        super( usercardsService );
    }

    // async getAll(req: any, res: any) {
    //     return super.getAll(req, res, req.query, req.params.filter || {});
    // };

    async getAll(req: any, res: any) {
        try {

            let param:any = req.query
            let filter:any = {}

            if(req.auth.role == UserRoles.USER){
                filter.user_id= new ObjectId(req.auth._id)
            }

            if(req.auth.role == UserRoles.ADMIN){
                if(param.user_id !== undefined){
                    filter.user_id= new ObjectId(param.user_id)
                }

            }else{
                filter.user_id= new ObjectId(req.auth._id)
            }

            if (param.pm_id !== undefined) {
                filter.pm_id = param.pm_id;
            }

            let order: any = DEFAULT_ORDER;
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

    // async create(req: any, res: any) {
    //     return super.create(req, res)
    // };

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

    async delete(req: any, res: any) {
        try {
            const id = new ObjectId(req.params.id);
            const result = await this.service.delete(id);
            return res.status(result.status_code).send(result.body);

        } catch (error) {
            console.log(error, 'delete');
            const error_result = Utils.getResponse(false, "Something went wrong", error, 500, 1005);
            return res.status(error_result.status_code).send(error_result.body);
        }
    };
}