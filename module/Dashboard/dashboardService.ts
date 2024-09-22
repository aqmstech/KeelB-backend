import { ObjectId } from "mongodb";
import { AuthModel } from "../_Auth/authModel";
import {DonationsModel} from "../Donations/donationsModel";
import PaymentStatus from "../../utils/enums/paymentStatus";
import {Utils} from "../../utils/utils";
import {RestaurantsModel} from "../Restaurants/restaurantsModel";
import {ReviewsModel} from "../Reviews/reviewsModel";
import {CategoriesModel} from "../Categories/categoriesModel";
import {UserRestaurantSuggestionsModel} from "../UserRestaurantSuggestions/userrestaurantsuggestionsModel";
import UserRoles from "../../utils/enums/userRoles";
import {UserFavoritesModel} from "../UserFavorites/userfavoritesModel";
import {AmbianceModel} from "../Ambiance/ambianceModel";
import {AreasModel} from "../Areas/areasModel";
import {CuisinesModel} from "../Cuisines/cuisinesModel";
import {DinningOptionsModel} from "../DinningOptions/dinningoptionsModel";
import {MealTypesModel} from "../MealTypes/mealtypesModel";
import {RestaurantTypeModel} from "../RestaurantType/restauranttypeModel";
import {FaqsModel} from "../_Faqs/faqsModel";

export class DashboardService {
    private static authModel: AuthModel = new AuthModel();
    private static restaurantsModel: RestaurantsModel = new RestaurantsModel();
    private static reviewsModel: ReviewsModel = new ReviewsModel();
    private static categoriesModel: CategoriesModel = new CategoriesModel();
    private static userRestaurantSuggestionsModel: UserRestaurantSuggestionsModel = new UserRestaurantSuggestionsModel();
    private static userFavoritesModel: UserFavoritesModel = new UserFavoritesModel();
    private static ambianceModel: AmbianceModel = new AmbianceModel();
    private static areasModel: AreasModel = new AreasModel();
    private static cuisinesModel: CuisinesModel = new CuisinesModel();
    private static dinningOptionsModel: DinningOptionsModel = new DinningOptionsModel();
    private static mealTypesModel: MealTypesModel = new MealTypesModel();
    private static restaurantTypeModel: RestaurantTypeModel = new RestaurantTypeModel();
    private static faqsModel: FaqsModel = new FaqsModel();

    public static async dashboardStats(req: any){
     try{
        let user_id = req.auth._id
        let userFavorites = 0 ;
        let isRestaurant = req?.auth?.role === UserRoles.RESTAURANT ;
        let users = await this.authModel.Count({ $or: [
                { role:10 },
                { role:20 }
            ],deletedAt:null})
        let sub_admins = await this.authModel.Count({role:40,deletedAt:null})
        let restaurants = await this.restaurantsModel.Count({deletedAt:null})
        let reviews = await this.reviewsModel.Count({deletedAt:null})
        let categories = await this.categoriesModel.Count({deletedAt:null})
        let userRestaurantSuggestions = await this.userRestaurantSuggestionsModel.Count({deletedAt:null})
        let ambiances = await this.ambianceModel.Count({deletedAt:null})
        let areas = await this.areasModel.Count({deletedAt:null})
        let cuisines = await this.cuisinesModel.Count({deletedAt:null})
        let dinningOptions = await this.dinningOptionsModel.Count({deletedAt:null})
        let mealTypes = await this.mealTypesModel.Count({deletedAt:null})
        let restaurantType = await this.restaurantTypeModel.Count({deletedAt:null})
        let faqs = await this.faqsModel.Count({deletedAt:null})


         if(isRestaurant){
             let user_restaurant = await this.restaurantsModel.GetOne({user_id:new ObjectId(user_id),deletedAt:null})
             if(user_restaurant){
                 reviews = await this.reviewsModel.Count({restaurant_id:new ObjectId(user_restaurant?._id),deletedAt:null})
                 userFavorites = await this.userFavoritesModel.Count({restaurant_id:new ObjectId(user_restaurant?._id),deletedAt:null})
             }

         }

         let data ={
             users,
             sub_admins,
             restaurants,
             categories,
             reviews,
             userRestaurantSuggestions,
             ambiances,
             areas,
             cuisines,
             dinningOptions,
             mealTypes,
             restaurantType,
             ...(isRestaurant ? {userFavorites} : null),
             faqs
         }
        return Utils.getResponse(true, "Record fetched successfully", data, 200, 1001);
    } catch (error) {
        console.log(error, 'error in service add')
        return Utils.getResponse(false, "Something went wrong", null, 500, 1005);
    }
    }

}