import { ContactUsModel} from './contactusModel';
import {BaseService} from "../../services/api/baseService";

export class ContactUsService extends BaseService {
    constructor() {
        const contactusModel = new ContactUsModel();
        super( contactusModel);
    }
}