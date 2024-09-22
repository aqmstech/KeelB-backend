import {BaseController} from "../../controllers/api/baseController";
import { RestaurantsService} from "./restaurantsService";
import { AuthService} from "../_Auth/authService";
import {DEFAULT_ORDER, DESC} from "../../utils/constants";
import {ObjectId} from "mongodb";
import {Utils} from "../../utils/utils";
import {AuthModel} from "../_Auth/authModel";
import UserRoles from "../../utils/enums/userRoles";

export class RestaurantsController extends BaseController {
    private authModel: AuthModel
    constructor() {
        const restaurantsService = new RestaurantsService()
        const authModel = new AuthModel();
        super( restaurantsService );
        this.authModel = authModel
    }

    async getAll(req: any, res: any) {
        try {
            let param = req.query
            let filter :any ={}
            let orConditions = [];
            let order: any = DEFAULT_ORDER;

            if(param.user_id !== undefined){
                filter.user_id= new ObjectId(param.user_id)
            }

            if(req?.auth?.role == UserRoles.USER){
                filter.isVerified= true
            }else{
                if(param.isVerified !== undefined) {
                    filter.isVerified = param.isVerified == 1 ? true : false
                }
            }


            const user = await this.authModel.findByQuery({_id:new ObjectId(req.auth._id)})

            if (param.name !== undefined) {
                const escapedTitle = param.name.replace(/[.*+\-?^${}()|[\]\\]/g, '\\$&');
                filter.name = { $regex: new RegExp(`^${escapedTitle}`, 'i') };
            }

            // Check if `keyword` is provided for email and fullname
            if (param.keyword) {
                const keywordRegex = { $regex: new RegExp(param.keyword, 'i') }; // 'i' for case-insensitive
                orConditions.push({ name: keywordRegex });
                orConditions.push({ description: keywordRegex });
            }

            // If there are any `$or` conditions, add them to the filter
            if (orConditions.length > 0) {
                filter.$or = orConditions;
            }

            const minPrice = parseFloat(param?.min_price);
            const maxPrice = parseFloat(param?.max_price);

            if (!isNaN(minPrice) && !isNaN(maxPrice)) {
                filter.min_price = { $lte: minPrice };
                filter.max_price = { $gte: maxPrice };
            } else if (!isNaN(minPrice)) {
                filter.min_price = { $lte: minPrice };
            } else if (!isNaN(maxPrice)) {
                filter.max_price = { $gte: maxPrice };
            }
            // if (param.location !== undefined) {
            //     // Assuming you have a function that calculates distance between two locations
            //     const userLocation = user.location;
            //     filter.location = {
            //         $near: {
            //             $geometry: {
            //                 type: "Point",
            //                 coordinates: userLocation?.coordinates
            //             },
            //             $maxDistance: param.location * 1000 // Convert km to meters
            //         }
            //     };
            // }

            if (param.location !== undefined) {
                const userLocation = user.location;

                // Ensure userLocation has valid coordinates
                if (userLocation?.coordinates && userLocation.coordinates.length === 2) {
                    filter.location = {
                        $geoWithin: {
                            $centerSphere: [
                                userLocation.coordinates, // User's coordinates [longitude, latitude]
                                param.location / 6378.1   // Radius of the sphere in radians (convert km to radians)
                            ]
                        }
                    };
                } else {
                    throw new Error("Invalid user location coordinates");
                }
            }

            if (param.cuisines !== undefined) {
                filter.cuisines = { $in: param.cuisines };  // Filters by cuisines that match any in the array
            }

            if (param.meal_type !== undefined) {
                filter.meal_type = { $in: param.meal_type };  // Filters by meal types that match any in the array
            }

            if (param.ambiance !== undefined) {
                filter.ambiance = { $in: param.ambiance };  // Filters by ambiance that match any in the array
            }

            if (param.areas !== undefined) {
                filter.areas = { $in: param.areas };  // Filters by cuisines that match any in the array
            }

            if (param.types !== undefined) {
                filter.types = { $in: param.types };  // Filters by meal types that match any in the array
            }

            if (param.dinning_options !== undefined) {
                filter.dinning_options = { $in: param.dinning_options };  // Filters by ambiance that match any in the array
            }

            if (param.categories !== undefined) {
                if(param.categories?.length){
                    let categories = param.categories?.map((item : string)=> new ObjectId(item) )
                    filter.categories =  { $in: categories } ;  // Filters by matching MongoDB object IDs in the array
                }
                }

            if(param.isFeatured !== undefined) {
                filter.isFeatured = param.isFeatured == 1 ? true : false
            }

            if(param.isFavourite !== undefined) {
                filter.isFavourite = param.isFavourite == 1 ? true : false
            }

            if (param.avg_rating !== undefined) {
                filter.avg_rating = {
                    $gte: parseInt(param.avg_rating) - 0.4, // Minimum value (example: for 4, this is 3.6)
                    $lt: parseInt(param.avg_rating) + 0.5  // Less than the given value + 0.05 (example: for 4, this is 4.05)
                };
            }


            if(param.status !== undefined) {
                filter.status = param.status == 1 ? true : false
            }
            if (param.order_by) {
                order = { [param.order_by]: parseInt(param?.order) || DESC }
            }

            const result = await this.service.getAll(order, param, filter,user?._id);
            return res.status(result.status_code).send(result.body);
        } catch (error) {
            console.log(error, 'getAll');
            const error_result = Utils.getResponse(false, "Something went wrong", error, 500, 1005);
            return res.status(error_result.status_code).send(error_result.body);
        }
    };

    async getById(req: any, res: any) {
        try {
            const id = new ObjectId(req.params.id);
            const user_id = new ObjectId(req.auth._id);
            const result = await this.service.getRestaurantById(id,user_id);
            return res.status(result.status_code).send(result.body);
        } catch (error) {
            console.log(error, 'getById');
            const error_result = Utils.getResponse(false, "Something went wrong", error, 500, 1005);
            return res.status(error_result.status_code).send(error_result.body);
        }
    };

    async create(req: any, res: any) {
        req.body.user_id = new ObjectId(req?.auth?._id)
        if( req.body.categories?.length){
            req.body.categories = req.body.categories?.map((item:string)=> new ObjectId(item))
        }
        let user = await this.authModel.GetOne({_id:new ObjectId(req?.auth?._id)});
        await this.authModel.Update(req?.auth?._id,{
            additionalFields:{
                ...user.additionalFields,
                is_restaurant_profile:true
            }
        })
        return super.create(req, res)
    };

    async update(req: any, res: any) {
        if( req.body.categories?.length){
            req.body.categories = req.body.categories?.map((item:string)=> new ObjectId(item))
        }
        return super.update(req, res)
    };

    async delete(req: any, res: any) {
        return super.delete(req, res)
    };
}