import {AdminBaseController} from "./adminBaseController";
import { SamplesService} from "../../services/api/samplesService";

export class SamplesAdminController extends AdminBaseController {
    constructor() {
        const samplesService = new SamplesService()
        super( samplesService );
    }

    async getAll(req: any, res: any) {
        return super.getAll(req, res, req.params, req.params.filter || {});
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