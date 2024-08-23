import { ObjectId } from "mongodb";
import { AuthModel } from "../_Auth/authModel";
import {DonationsModel} from "../Donations/donationsModel";
import PaymentStatus from "../../utils/enums/paymentStatus";
import {VideosModel} from "../Videos/videosModel";
import {Utils} from "../../utils/utils";

export class DashboardService {
    private static authModel: AuthModel = new AuthModel();
    private static donationModel: DonationsModel = new DonationsModel();
    private static videosModel: VideosModel = new VideosModel();

    public static async dashboardStats(req: any){
     try{
        let user_id = req.auth._id
        let users = await this.authModel.Count({role:10,deletedAt:null})
        let videos = await this.videosModel.Count({deletedAt:null})
        let payments_made = await this.donationModel.Count({status:PaymentStatus.PAID})
        let donations_collected = await this.donationModel.getTotalPaidAmount({status:PaymentStatus.PAID})
        return Utils.getResponse(true, "Record fetched successfully", {users,videos,payments_made,donations_collected}, 200, 1001);
    } catch (error) {
        console.log(error, 'error in service add')
        return Utils.getResponse(false, "Something went wrong", null, 500, 1005);
    }
    }

}