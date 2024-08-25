import {BaseController} from "../../controllers/api/baseController";
import { RecentSearchesService} from "./recentsearchesService";
import UserRoles from "../../utils/enums/userRoles";
import { ObjectId } from "mongodb";
import {Utils} from "../../utils/utils";
import {DEFAULT_ORDER, DESC} from "../../utils/constants";

export class RecentSearchesController extends BaseController {
    constructor() {
        const recentsearchesService = new RecentSearchesService()
        super( recentsearchesService );
    }

    async getAll(req: any, res: any) {
        try{
        let param = req.query
        let filter :any ={}
        let order: any = DEFAULT_ORDER;
         if(req?.auth?.role == UserRoles.USER){
             filter.user_id = new ObjectId(req?.auth?._id)
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


    protected async deleteAll(req: any, res: any) {
        try {
            const result = await this.service.deleteAll(req, res);
            return res.status(result.status_code).send(result.body);

        } catch (error) {
            console.log(error, 'delete');
            const error_result = Utils.getResponse(false, "Something went wrong", error, 500, 1005);
            return res.status(error_result.status_code).send(error_result.body);
        }
    };
}