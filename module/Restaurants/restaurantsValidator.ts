import RestaurantStatus from "../../utils/enums/restaurantStatus";

const Joi = require('joi');

export const addRestaurantsValidator = Joi.object().keys(
    {
        name: Joi.string().min(2).max(255).required(),
        cover_image: Joi.string().min(2).max(255).optional(),
        image: Joi.string().min(2).max(255).optional().allow(null),
        description: Joi.string().min(2).required(),
        address: Joi.string().min(2),
        reason: Joi.string().min(2),
        user_id: Joi.string().min(2).max(255),
        min_price: Joi.number().required(),
        max_price: Joi.number().required(),
        avg_rating: Joi.number(),
        menu: Joi.any(),
        currency_type: Joi.string().min(2).max(255).optional(),
        location: Joi.any().required(),
        cuisines: Joi.array().max(50),
        meal_type: Joi.array().max(50),
        ambiance: Joi.array().max(50),
        categories: Joi.array().max(50),
        areas: Joi.array().max(50),
        dinning_options: Joi.array().max(50),
        types: Joi.array().max(50),
        timings: Joi.array().max(7),
        accepted_payment_types: Joi.string().valid('cash', 'card','cash/card'),
        service_types: Joi.string().valid('dine in', 'dine in/delivery', 'delivery'),
        service_time: Joi.any(),
        isFeatured: Joi.boolean(),
        isVerified: Joi.string().valid(RestaurantStatus.ACCEPTED,RestaurantStatus.PENDING,RestaurantStatus.REJECTED),
        status: Joi.string().valid('open', 'close'),
        updatedAt: Joi.date(),
        deletedAt: Joi.date()
    }
);

export const updateRestaurantsValidator = Joi.object().keys(
    {
            name: Joi.string().min(2).max(255).required(),
            cover_image: Joi.string().min(2).max(255).optional(),
            image: Joi.string().min(2).max(255).optional(),
            description: Joi.string().min(2).required(),
            address: Joi.string().min(2),
            reason: Joi.string().min(2),
            user_id: Joi.string().min(2).max(255),
            min_price: Joi.number().required(),
            max_price: Joi.number().required(),
            avg_rating: Joi.number(),
            menu: Joi.any(),
            currency_type: Joi.string().min(2).max(255).optional(),
            location: Joi.any().required(),
            cuisines: Joi.array().max(50),
            meal_type: Joi.array().max(50),
            ambiance: Joi.array().max(50),
            categories: Joi.array().max(50),
            areas: Joi.array().max(50),
            dinning_options: Joi.array().max(50),
            types: Joi.array().max(50),
            timings: Joi.array().max(7),
            accepted_payment_types: Joi.string().valid('cash', 'card','cash/card'),
            service_types: Joi.string().valid('dine in', 'dine in/delivery', 'delivery'),
            service_time: Joi.any(),
            isFeatured: Joi.boolean(),
            isVerified: Joi.string().valid(RestaurantStatus.ACCEPTED,RestaurantStatus.PENDING,RestaurantStatus.REJECTED),
            status: Joi.string().valid('open', 'close'),
            updatedAt: Joi.date(),
            deletedAt: Joi.date()
    }
);

export const updateRestaurantsStatusValidator = Joi.object().keys(
    {
        isVerified: Joi.string().valid(RestaurantStatus.ACCEPTED,RestaurantStatus.PENDING,RestaurantStatus.REJECTED),
        reason: Joi.string().min(2),
    }
);

export const getAllRestaurantsValidator = Joi.object().keys(
    {
        name: Joi.string().min(2).max(255),
        cover_image: Joi.string().min(2).max(255),
        image: Joi.string().min(2).max(255).optional(),
        description: Joi.string().min(2),
        address: Joi.string().min(2),
        reason: Joi.string().min(2),
        user_id: Joi.string().min(2).max(255),
        min_price: Joi.number(),
        max_price: Joi.number(),
        avg_rating: Joi.number(),
        menu: Joi.any(),
        currency_type: Joi.string().min(2).max(255),
        location: Joi.any(),
        distance: Joi.number(),
        lat: Joi.number(),
        lng: Joi.number(),
        cuisines: Joi.array().max(50),
        meal_type: Joi.array().max(50),
        ambiance: Joi.array().max(50),
        categories: Joi.array().max(50),
        areas: Joi.array().max(50),
        dinning_options: Joi.array().max(50),
        types: Joi.array().max(50),
        timings: Joi.array().max(7),
        accepted_payment_types: Joi.string().valid('cash', 'card'),
        service_types: Joi.string().valid('dine in', 'dine in/delivery', 'delivery'),
        service_time: Joi.any(),
        isFeatured: Joi.boolean(),
        isVerified: Joi.string().valid(RestaurantStatus.ACCEPTED,RestaurantStatus.PENDING,RestaurantStatus.REJECTED),
        status: Joi.string().valid('open', 'close'),
        createdAt: Joi.date(),
        updatedAt: Joi.date(),
        deletedAt: Joi.date(),
        keyword: Joi.any(),
        withoutPagination: Joi.any(),
        page: Joi.any(),
        per_page: Joi.any()
    }
);

