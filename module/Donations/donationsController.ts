import {BaseController} from "../../controllers/api/baseController";
import { DonationsService} from "./donationsService";
import {Utils} from "../../utils/utils";
import UserRoles from "../../utils/enums/userRoles";
import {DEFAULT_ORDER, DESC} from "../../utils/constants";
import { ObjectId } from "mongodb";

export class DonationsController extends BaseController {
    constructor() {
        const donationsService = new DonationsService()
        super( donationsService );
    }

    // async getAll(req: any, res: any) {
    //     return super.getAll(req, res, req.params, req.params.filter || {});
    // };
     async getAll(req: any, res: any, param: any = {}, filter: any = {}) {
        try {
            let order: any = DEFAULT_ORDER;
            param = req.query
            if(req.auth.role == UserRoles.USER){
                filter.deletedAt = null;
                filter.user_id= new ObjectId(req.auth._id)
            }
            if(req.auth.role == UserRoles.ADMIN){
                if(param.user_id !== undefined){
                    filter.user_id= new ObjectId(param.user_id)
                }

            }

            if (param.amount !== undefined) {
                filter.amount = param.amount;
            }

            if (param.donor_name !== undefined) {
                const escapedTitle = param.donor_name.replace(/[.*+\-?^${}()|[\]\\]/g, '\\$&');
                filter.donor_name = { $regex: new RegExp(`^${escapedTitle}`, 'i') };
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
        return super.delete(req, res)
    };
}