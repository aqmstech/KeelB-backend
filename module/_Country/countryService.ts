import { CountryModel } from './countryModel';
import { BaseService } from "../../services/api/baseService";

export class CountryService extends BaseService {
    constructor() {
        const countryModel = new CountryModel();
        super(countryModel);
    }
}