import express from "express";
import {AdminAuthMiddleware} from '../../middlewares/api/auth';

const routes = express.Router();
import {ContactUsController} from "./contactusController";
import {
    addContactUsValidator,
    updateContactUsValidator,
    getAllContactUsValidator
} from "./contactusValidator";

import {validateRequestBody, validateRequestParams} from "../../utils/validator/ValidateRequest";

// const contactusController = new ContactUsController(); // Create an instance of Controller

// routes.use(AdminAuthMiddleware);

routes.get('/', validateRequestParams(getAllContactUsValidator), (req: any, res: any) => {
    const contactusController = new ContactUsController();
    contactusController.getAll(req, res)
});
routes.get('/:id', (req: any, res: any) => {
    const contactusController = new ContactUsController();
    contactusController.getById(req, res)
});
routes.post('/', validateRequestBody(addContactUsValidator), (req: any, res: any) => {
    const contactusController = new ContactUsController();
    contactusController.create(req, res)
});
routes.put('/:id', validateRequestBody(updateContactUsValidator), (req: any, res: any) => {
    const contactusController = new ContactUsController();
    contactusController.update(req, res)
});
routes.delete('/:id', (req: any, res: any) => {
    const contactusController = new ContactUsController();
    contactusController.delete(req, res)
});


export const router = routes;