import {Utils} from "../../utils/utils";
import {DashboardService} from "./dashboardService";

export class DashboardController {

    public static async dashboardStats(req: any, res: any) {
        try {
            const result :any = await DashboardService.dashboardStats(req);
            return res.status(result.status_code).send(result.body);
        } catch (error) {
            console.log(error, 'getAll');
            const error_result = Utils.getResponse(false, "Something went wrong", error, 500, 1005);
            return res.status(error_result.status_code).send(error_result.body);
        }
    };
}