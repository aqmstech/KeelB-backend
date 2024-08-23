import express from "express";
// import {AdminAuthMiddleware} from '../../../middlewares/api/auth';

const routes = express.Router();
import {SamplesAdminController} from "../../../controllers/admin/adminSamplesController";
import {
    addSamplesValidator,
    updateSamplesValidator,
    getAllSamplesValidator
} from "../../../utils/validator/SamplesValidator";

import {validateRequestBody, validateRequestParams} from "../../../utils/validator/ValidateRequest";

// routes.use(AdminAuthMiddleware);

routes.get('/', validateRequestParams(getAllSamplesValidator), (req: any, res: any) => {
    const adminSamplesController = new SamplesAdminController();
    adminSamplesController.getAll(req, res)
});
routes.get('/:id', (req: any, res: any) => {
    const adminSamplesController = new SamplesAdminController();
    adminSamplesController.getById(req, res)
});
routes.post('/', validateRequestParams(addSamplesValidator), (req: any, res: any) => {
    const adminSamplesController = new SamplesAdminController();
    adminSamplesController.create(req, res)
});
routes.put('/:id', validateRequestParams(updateSamplesValidator), (req: any, res: any) => {
    const adminSamplesController = new SamplesAdminController();
    adminSamplesController.update(req, res)
});
routes.delete('/:id', (req: any, res: any) => {
    const adminSamplesController = new SamplesAdminController();
    adminSamplesController.delete(req, res)
});


export const router = routes;