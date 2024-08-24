import {BaseController} from "../../controllers/api/baseController";
import { RecentSearchesService} from "./recentsearchesService";

export class RecentSearchesController extends BaseController {
    constructor() {
        const recentsearchesService = new RecentSearchesService()
        super( recentsearchesService );
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