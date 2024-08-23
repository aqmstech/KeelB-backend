import { CityModel } from './cityModel';
import { BaseService } from "../../services/api/baseService";

export class CityService extends BaseService {
    constructor() {
        const cityModel = new CityModel();
        super(cityModel);
    }
}