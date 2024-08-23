import express from "express";

const routes = express.Router();
import {SamplesController} from "../../../controllers/api/samplesController";
import {
    addSamplesValidator,
    updateSamplesValidator,
    getAllSamplesValidator
} from "../../../utils/validator/SamplesValidator";

import {validateRequestBody, validateRequestParams} from "../../../utils/validator/ValidateRequest";

routes.get('/', validateRequestParams(getAllSamplesValidator), (req: any, res: any) => {
    const samplesController = new SamplesController();
    samplesController.getAll(req, res)
});
routes.get('/:id', (req: any, res: any) => {
    const samplesController = new SamplesController();
    samplesController.getById(req, res)
});
routes.post('/', validateRequestBody(addSamplesValidator), (req: any, res: any) => {
    const samplesController = new SamplesController();
    samplesController.create(req, res)
});
routes.put('/:id', validateRequestBody(updateSamplesValidator), (req: any, res: any) => {
    const samplesController = new SamplesController();
    samplesController.update(req, res)
});
routes.delete('/:id', (req: any, res: any) => {
    const samplesController = new SamplesController();
    samplesController.delete(req, res)
});


export const router = routes;