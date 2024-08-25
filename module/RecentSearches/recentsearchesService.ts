import { RecentSearchesModel} from './recentsearchesModel';
import {BaseService} from "../../services/api/baseService";
import {Utils} from "../../utils/utils";

export class RecentSearchesService extends BaseService {
    constructor() {
        const recentsearchesModel = new RecentSearchesModel();
        super( recentsearchesModel);
    }

    protected async deleteAll(req: any, res: any) {
        try {
            console.log(req?.auth?._id,"req?.auth?._id")
            await this.model.DeleteMany({user_id: req?.auth?._id});
            return Utils.getResponse(true, "Recent searches deleted successfully", null, 200, 1003);

        } catch (error) {
            console.log(error,"deleteAll")
            return Utils.getResponse(false, "Something went wrong", null, 500, 1005);
        }
    }
}