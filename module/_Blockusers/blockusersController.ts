import { BaseController } from "../../controllers/api/baseController";
import { BlockusersService } from "./blockusersService";

export class BlockusersController extends BaseController {
    private blockusersService: BlockusersService
    constructor() {
        const blockusersService = new BlockusersService()
        super(blockusersService);
        this.blockusersService = blockusersService
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

    async blockOrUnblockUser(req: any, res: any) {
        return this.blockusersService.blockOrUnblockUser(req, res)
    };

    async blockUsersList(req: any, res: any) {
        return this.blockusersService.blockUsersList(req, res)
    };
}