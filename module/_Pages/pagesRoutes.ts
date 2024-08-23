import express from "express";
import { AdminAuthMiddleware } from '../../middlewares/api/auth';

const routes = express.Router();
import { PagesController } from "./pagesController";
import {
    addPagesValidator,
    updatePagesValidator,
    getAllPagesValidator
} from "./pagesValidator";

import { validateRequestBody, validateRequestParams } from "../../utils/validator/ValidateRequest";

// const pagesController = new PagesController(); // Create an instance of Controller

// routes.use(AdminAuthMiddleware);

routes.get('/', validateRequestParams(getAllPagesValidator), (req: any, res: any) => {
    const pagesController = new PagesController();
    pagesController.getAll(req, res)
});
routes.get('/:id', (req: any, res: any) => {
    const pagesController = new PagesController();
    pagesController.getById(req, res)
});
routes.get('/slug/:id', (req: any, res: any) => {
    const pagesController = new PagesController();
    pagesController.getBySlug(req, res)
});
routes.post('/', validateRequestBody(addPagesValidator), (req: any, res: any) => {
    const pagesController = new PagesController();
    pagesController.create(req, res)
});
routes.put('/:id', validateRequestBody(updatePagesValidator), (req: any, res: any) => {
    const pagesController = new PagesController();
    pagesController.update(req, res)
});

routes.delete('/:id', (req: any, res: any) => {
    const pagesController = new PagesController();
    pagesController.delete(req, res)
});


export const router = routes;