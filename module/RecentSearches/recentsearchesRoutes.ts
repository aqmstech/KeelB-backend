import express from "express";
import {AdminAuthMiddleware} from '../../middlewares/api/auth';

const routes = express.Router();
import {RecentSearchesController} from "./recentsearchesController";
import {
    addRecentSearchesValidator,
    updateRecentSearchesValidator,
    getAllRecentSearchesValidator
} from "./recentsearchesValidator";

import {validateRequestBody, validateRequestParams} from "../../utils/validator/ValidateRequest";
import requireUser from "../../controllers/global/requiredUser";

// const recentsearchesController = new RecentSearchesController(); // Create an instance of Controller

routes.use(requireUser);

routes.get('/', validateRequestParams(getAllRecentSearchesValidator), (req: any, res: any) => {
    const recentsearchesController = new RecentSearchesController();
    recentsearchesController.getAll(req, res)
});
routes.get('/:id', (req: any, res: any) => {
    const recentsearchesController = new RecentSearchesController();
    recentsearchesController.getById(req, res)
});
routes.post('/', validateRequestBody(addRecentSearchesValidator), (req: any, res: any) => {
    const recentsearchesController = new RecentSearchesController();
    recentsearchesController.create(req, res)
});
routes.put('/:id', validateRequestBody(updateRecentSearchesValidator), (req: any, res: any) => {
    const recentsearchesController = new RecentSearchesController();
    recentsearchesController.update(req, res)
});


routes.delete('/all', (req: any, res: any) => {
    const recentsearchesController = new RecentSearchesController();
    recentsearchesController.deleteAll(req, res)
});

routes.delete('/:id', (req: any, res: any) => {
    const recentsearchesController = new RecentSearchesController();
    recentsearchesController.delete(req, res)
});



export const router = routes;