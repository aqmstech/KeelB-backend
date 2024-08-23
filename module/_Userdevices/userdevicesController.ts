import {BaseController} from "../../controllers/api/baseController";
import { UserdevicesService} from "./userdevicesService";

export class UserdevicesController extends BaseController {
    private userdevicesService: UserdevicesService
    constructor() {
        const userdevicesService = new UserdevicesService()
        super( userdevicesService );
        this.userdevicesService = userdevicesService
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

    async getDevicesOfUsers(req: any, res: any) {
        return this.userdevicesService.getDevicesOfUsers(req, res)
    };
}