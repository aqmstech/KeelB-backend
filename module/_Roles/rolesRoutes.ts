import express from "express";
import {AdminAuthMiddleware} from '../../middlewares/api/auth';

const routes = express.Router();
import {RolesController} from "./rolesController";
import {
    addRolesValidator,
    updateRolesValidator,
    getAllRolesValidator
} from "./rolesValidator";

import {validateRequestBody, validateRequestParams} from "../../utils/validator/ValidateRequest";

// const rolesController = new RolesController(); // Create an instance of Controller

// routes.use(AdminAuthMiddleware);

routes.get('/', validateRequestParams(getAllRolesValidator), (req: any, res: any) => {
    const rolesController = new RolesController();
    rolesController.getAll(req, res)
});
routes.get('/:id', (req: any, res: any) => {
    const rolesController = new RolesController();
    rolesController.getById(req, res)
});
routes.post('/', validateRequestBody(addRolesValidator), (req: any, res: any) => {
    const rolesController = new RolesController();
    rolesController.create(req, res)
});
routes.put('/:id', validateRequestBody(updateRolesValidator), (req: any, res: any) => {
    const rolesController = new RolesController();
    rolesController.update(req, res)
});
routes.delete('/:id', (req: any, res: any) => {
    const rolesController = new RolesController();
    rolesController.delete(req, res)
});


export const router = routes;