import {BaseController} from "../../controllers/api/baseController";
import { DinningOptionsService} from "./dinningoptionsService";

export class DinningOptionsController extends BaseController {
    constructor() {
        const dinningoptionsService = new DinningOptionsService()
        super( dinningoptionsService );
    }

    async getAll(req: any, res: any) {
        let param = req.query
        let filter :any ={}

        if (param.keyword !== undefined) {
            const escapedTitle = param.keyword.replace(/[.*+\-?^${}()|[\]\\]/g, '\\$&');
            filter.name = { $regex: new RegExp(`^${escapedTitle}`, 'i') };
        }
        return super.getAll(req, res, req.query, filter || {});
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