import { FaqsModel } from './faqsModel';
import { BaseService } from "../../services/api/baseService";

export class FaqsService extends BaseService {
    constructor() {
        const faqsModel = new FaqsModel();
        super(faqsModel);
    }
}