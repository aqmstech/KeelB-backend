import {Utils} from '../../utils/utils';
import {DEFAULT_ORDER} from "../../utils/constants";
import {ObjectId} from "mongodb";


export class AdminBaseController {
    protected service: any;

    constructor(service: any) {
        this.service = service;
    }

    protected async getAll(req: any, res: any, param: any = {}, filter: any = {}) {
        try {
            let order: any = DEFAULT_ORDER;
            const result = await this.service.getAll(order, param, filter);
            return res.status(result.status_code).send(result.body);

        } catch (error) {
            console.log(error, 'getAll');
            const error_result = Utils.getResponse(false, "Something went wrong", error, 500, 1005);
            return res.status(error_result.status_code).send(error_result.body);
        }
    };

    protected async getById(req: any, res: any) {
        try {
            const id = new ObjectId(req.params.id);
            const result = await this.service.getById(id);
            return res.status(result.status_code).send(result.body);

        } catch (error) {
            console.log(error, 'getById');
            const error_result = Utils.getResponse(false, "Something went wrong", error, 500, 1005);
            return res.status(error_result.status_code).send(error_result.body);
        }
    };

    protected async create(req: any, res: any) {
        try {
            const result = await this.service.create(req.body);
            return res.status(result.status_code).send(result.body);

        } catch (error) {
            console.log(error, 'create');
            const error_result = Utils.getResponse(false, "Something went wrong", error, 500, 1005);
            return res.status(error_result.status_code).send(error_result.body);
        }
    };

    protected async update(req: any, res: any) {
        try {
            const id = new ObjectId(req.params.id);
            const result = await this.service.update(id, req.body);
            return res.status(result.status_code).send(result.body);

        } catch (error) {
            console.log(error, 'update');
            const error_result = Utils.getResponse(false, "Something went wrong", error, 500, 1005);
            return res.status(error_result.status_code).send(error_result.body);
        }
    };

    protected async delete(req: any, res: any) {
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

