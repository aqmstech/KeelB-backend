import { RecentSearchesModel} from './recentsearchesModel';
import {BaseService} from "../../services/api/baseService";

export class RecentSearchesService extends BaseService {
    constructor() {
        const recentsearchesModel = new RecentSearchesModel();
        super( recentsearchesModel);
    }
}