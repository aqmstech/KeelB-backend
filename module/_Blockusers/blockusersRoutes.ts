import express from "express";
import { AdminAuthMiddleware } from '../../middlewares/api/auth';

const routes = express.Router();
import { BlockusersController } from "./blockusersController";
import {
    addBlockusersValidator,
    updateBlockusersValidator,
    getAllBlockusersValidator
} from "./blockusersValidator";

import { validateRequestBody, validateRequestParams } from "../../utils/validator/ValidateRequest";
import requireUser from "../../controllers/global/requiredUser";

// const blockusersController = new BlockusersController(); // Create an instance of Controller

// routes.use(AdminAuthMiddleware);

// routes.get('/', validateRequestParams(getAllBlockusersValidator), (req: any, res: any) => {
//     const blockusersController = new BlockusersController();
//     blockusersController.getAll(req, res)
// });
// routes.get('/:id', (req: any, res: any) => {
//     const blockusersController = new BlockusersController();
//     blockusersController.getById(req, res)
// });
// routes.post('/', validateRequestBody(addBlockusersValidator), (req: any, res: any) => {
//     const blockusersController = new BlockusersController();
//     blockusersController.create(req, res)
// });
// routes.put('/:id', validateRequestBody(updateBlockusersValidator), (req: any, res: any) => {
//     const blockusersController = new BlockusersController();
//     blockusersController.update(req, res)
// });
// routes.delete('/:id', (req: any, res: any) => {
//     const blockusersController = new BlockusersController();
//     blockusersController.delete(req, res)
// });

// routes.post("/block-unblock", requireUser, blockOrUnblockUser);
routes.post('/block-unblock', requireUser, validateRequestBody(addBlockusersValidator), (req: any, res: any) => {
    const blockusersController = new BlockusersController();
    blockusersController.blockOrUnblockUser(req, res)
});

routes.get('/list', requireUser, (req: any, res: any) => {
    const blockusersController = new BlockusersController();
    blockusersController.blockUsersList(req, res)
});

export const router = routes;