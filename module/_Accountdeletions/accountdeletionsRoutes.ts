import express from "express";
import {AdminAuthMiddleware} from '../../middlewares/api/auth';

const routes = express.Router();
import {AccountdeletionsController} from "./accountdeletionsController";
import {
    addAccountdeletionsValidator,
    updateAccountdeletionsValidator,
    getAllAccountdeletionsValidator
} from "./accountdeletionsValidator";

import {validateRequestBody, validateRequestParams} from "../../utils/validator/ValidateRequest";

// const accountdeletionsController = new AccountdeletionsController(); // Create an instance of Controller

// routes.use(AdminAuthMiddleware);

routes.get('/', validateRequestParams(getAllAccountdeletionsValidator), (req: any, res: any) => {
    const accountdeletionsController = new AccountdeletionsController();
    accountdeletionsController.getAll(req, res)
});
routes.get('/:id', (req: any, res: any) => {
    const accountdeletionsController = new AccountdeletionsController();
    accountdeletionsController.getById(req, res)
});
routes.post('/', validateRequestBody(addAccountdeletionsValidator), (req: any, res: any) => {
    const accountdeletionsController = new AccountdeletionsController();
    accountdeletionsController.create(req, res)
});
routes.put('/:id', validateRequestBody(updateAccountdeletionsValidator), (req: any, res: any) => {
    const accountdeletionsController = new AccountdeletionsController();
    accountdeletionsController.update(req, res)
});
routes.delete('/:id', (req: any, res: any) => {
    const accountdeletionsController = new AccountdeletionsController();
    accountdeletionsController.delete(req, res)
});


export const router = routes;