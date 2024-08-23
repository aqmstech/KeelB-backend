import express from "express";
import { AdminAuthMiddleware } from '../../middlewares/api/auth';

const routes = express.Router();
import { UserdevicesController } from "./userdevicesController";
import {
    addUserdevicesValidator,
    updateUserdevicesValidator,
    getAllUserdevicesValidator,
    getDevicesOfUserValidator
} from "./userdevicesValidator";

import { validateRequestBody, validateRequestParams } from "../../utils/validator/ValidateRequest";
import requireUser from "../../controllers/global/requiredUser";

// const userdevicesController = new UserdevicesController(); // Create an instance of Controller

// routes.use(AdminAuthMiddleware);

routes.get('/', validateRequestParams(getAllUserdevicesValidator), (req: any, res: any) => {
    const userdevicesController = new UserdevicesController();
    userdevicesController.getAll(req, res)
});
routes.get('/:id', (req: any, res: any) => {
    const userdevicesController = new UserdevicesController();
    userdevicesController.getById(req, res)
});
routes.post('/', validateRequestBody(addUserdevicesValidator), (req: any, res: any) => {
    const userdevicesController = new UserdevicesController();
    userdevicesController.create(req, res)
});
routes.put('/:id', validateRequestBody(updateUserdevicesValidator), (req: any, res: any) => {
    const userdevicesController = new UserdevicesController();
    userdevicesController.update(req, res)
});
routes.delete('/:id', (req: any, res: any) => {
    const userdevicesController = new UserdevicesController();
    userdevicesController.delete(req, res)
});

routes.post('/list', requireUser, validateRequestBody(getDevicesOfUserValidator), (req: any, res: any) => {
    const userdevicesController = new UserdevicesController();
    userdevicesController.getDevicesOfUsers(req, res)
});

export const router = routes;