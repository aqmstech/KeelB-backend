import {BaseController} from "../../controllers/api/baseController";
import { RestaurantsService} from "./restaurantsService";
import { AuthService} from "../_Auth/authService";
import {DEFAULT_ORDER, DESC} from "../../utils/constants";
import {ObjectId} from "mongodb";
import {Utils} from "../../utils/utils";
import {AuthModel} from "../_Auth/authModel";

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

            console.log(req.auth)
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
            console.log(param.categories,'param.categories')
            if (param.categories !== undefined) {
                if(param.categories?.length){
                    let categories = param.categories?.map((item : string)=> new ObjectId(item) )
                    filter.categories =  { $in: categories } ;  // Filters by matching MongoDB object IDs in the array
                }
                }

            if(param.isVerified !== undefined) {
                filter.isVerified = param.isVerified == 1 ? true : false
            }

            if(param.isFeatured !== undefined) {
                filter.isFeatured = param.isFeatured == 1 ? true : false
            }

            if(param.avg_rating !== undefined) {
                filter.avg_rating = param.avg_rating
            }

            if(param.status !== undefined) {
                filter.status = param.status == 1 ? true : false
            }
            if (param.order_by) {
                order = { [param.order_by]: parseInt(param?.order) || DESC }
            }

            const result = await this.service.getAll(order, param, filter);
            return res.status(result.status_code).send(result.body);
        } catch (error) {
            console.log(error, 'getAll');
            const error_result = Utils.getResponse(false, "Something went wrong", error, 500, 1005);
            return res.status(error_result.status_code).send(error_result.body);
        }
    };

    async getById(req: any, res: any) {
        return super.getById(req, res);
    };

    async create(req: any, res: any) {
        return super.create(req, res)
    };

    async update(req: any, res: any) {
        return super.update(req, res)
    };

    async delete(req: any, res: any) {
        return super.delete(req, res)
    };
}