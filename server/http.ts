import express from 'express';
import cors from 'cors';

//Config Imports
import {HTTPCONF} from '../configs/http';

//Global Router Imports
import * as Middleware from '../controllers/global/middleware';
import * as AssetRouter from '../controllers/global/assets';
import * as DefaultRouter from '../controllers/global/default';
//Router Imports
// @ts-ignore
// API / Admin Routers
import * as SamplesRouter from '../routes/api/v1/samplesRoutes' 
import * as SamplesAdminRouter from '../routes/admin/v1/samplesAdminRoutes'
import * as AuthRouter from '../module/_Auth/authRoutes' 
import * as RolesRouter from '../module/_Roles/rolesRoutes'
import * as UserdevicesRouter from '../module/_Userdevices/userdevicesRoutes' 
import * as BlockusersRouter from '../module/_Blockusers/blockusersRoutes' 
import * as SecurityquestionsRouter from '../module/_Securityquestions/securityquestionsRoutes' 
import * as SocialaccountsRouter from '../module/_Socialaccounts/socialaccountsRoutes' 
import * as AccountdeletionsRouter from '../module/_Accountdeletions/accountdeletionsRoutes' 
import * as FaqsRouter from '../module/_Faqs/faqsRoutes' 
import * as RegionsRouter from '../module/_Regions/regionsRoutes' 
import * as PagesRouter from '../module/_Pages/pagesRoutes' 
import * as SubregionsRouter from '../module/_Subregions/subregionsRoutes' 
import * as CountryRouter from '../module/_Country/countryRoutes' 
import * as StatesRouter from '../module/_States/statesRoutes' 
import * as CityRouter from '../module/_City/cityRoutes'
import * as NotificationsRouter from '../module/Notifications/notificationsRoutes'
import * as PaymentRouter from '../module/Payments/paymentRoutes'
import * as UserCardsRouter from '../module/UserCards/usercardsRoutes'
import * as ContactUsRouter from '../module/ContactUs/contactusRoutes'
import * as RecentSearchesRouter from '../module/RecentSearches/recentsearchesRoutes'
import * as UserRestaurantSuggestionsRouter from '../module/UserRestaurantSuggestions/userrestaurantsuggestionsRoutes'
import * as CategoriesRouter from '../module/Categories/categoriesRoutes'
import * as UserfavoritesRouter from '../module/UserFavorites/userfavoritesRoutes'
import * as RestaurantsRouter from '../module/Restaurants/restaurantsRoutes'
import * as ReviewsRouter from '../module/Reviews/reviewsRoutes'
import * as AmbianceRoutes from '../module/Ambiance/ambianceRoutes'
import * as CuisinesRoutes from '../module/Cuisines/cuisinesRoutes'
import * as MealtypesRoutes from '../module/MealTypes/mealtypesRoutes'
import * as AreasRoutes from '../module/Areas/areasRoutes'
import * as DinningoptionsRoutes from '../module/DinningOptions/dinningoptionsRoutes'
import * as RestauranttypeRoutes from '../module/RestaurantType/restauranttypeRoutes'
import * as DashboardRouter from '../module/Dashboard/dashboardRoutes'

import * as http from 'http';
import stoppable from 'stoppable';
import {Sentry} from './sentry';

import {errorHandler} from "../utils/validator/errorHandler";

export class HTTPServer {
    public static server: HTTPServer;
    public static conf: HTTPCONF;
    public app: any;
    private httpServer!: http.Server & stoppable.WithStop;

    private constructor(conf: HTTPCONF) {
        this.app = express();
    }

    static INIT(conf: HTTPCONF, test: boolean = false): HTTPServer {
        if (!HTTPServer.server) {
            HTTPServer.conf = conf;
            HTTPServer.server = new HTTPServer(conf);
            HTTPServer.RegisterRouter();
            !test && HTTPServer.StartServer(conf.PORT);
            return HTTPServer.server;
        } else return HTTPServer.server;
    }

    static RegisterRouter() {
        //Allow Cors For All
        this.server.app.use(cors({allowedHeaders: '*', origin: '*'}));

        // parse application/x-www-form-urlencoded
        this.server.app.use(express.urlencoded({extended: false}));

        // parse application/json
        this.server.app.use(express.json());

        //Middleware route must be stayed at the beginning.
        this.server.app.use(Middleware.router);

        this.server.app.use('/assets', AssetRouter.router);
        this.server.app.use('/.well-known', express.static('.well-known'));
        //Admin / API routes Register Here
        this.server.app.use("/api/v1/samples", SamplesRouter.router) 
        this.server.app.use("/admin/v1/samples", SamplesAdminRouter.router)
        this.server.app.use("/api/v1/auth", AuthRouter.router)
        this.server.app.use("/api/v1/dashboard", DashboardRouter.router)
        this.server.app.use("/api/v1/roles", RolesRouter.router)
        this.server.app.use("/api/v1/userdevices", UserdevicesRouter.router) 
        this.server.app.use("/api/v1/blockusers", BlockusersRouter.router) 
        this.server.app.use("/api/v1/securityquestions", SecurityquestionsRouter.router) 
        this.server.app.use("/api/v1/socialaccounts", SocialaccountsRouter.router) 
        this.server.app.use("/api/v1/accountdeletions", AccountdeletionsRouter.router) 
        this.server.app.use("/api/v1/faqs", FaqsRouter.router) 
        this.server.app.use("/api/v1/regions", RegionsRouter.router) 
        this.server.app.use("/api/v1/pages", PagesRouter.router) 
        this.server.app.use("/api/v1/subregions", SubregionsRouter.router) 
        this.server.app.use("/api/v1/countries", CountryRouter.router) 
        this.server.app.use("/api/v1/states", StatesRouter.router) 
        this.server.app.use("/api/v1/cities", CityRouter.router) 
        
        this.server.app.use("/api/v1/notifications", NotificationsRouter.router)
        // this.server.app.use("/api/v1/payment", PaymentRouter.router)
        // this.server.app.use("/api/v1/card", UserCardsRouter.router)
        this.server.app.use("/api/v1/contact-us", ContactUsRouter.router)
        this.server.app.use("/api/v1/categories", CategoriesRouter.router)
        this.server.app.use("/api/v1/recentsearches", RecentSearchesRouter.router)
        this.server.app.use("/api/v1/userfavorites", UserfavoritesRouter.router)
        this.server.app.use("/api/v1/restaurants", RestaurantsRouter.router)
        this.server.app.use("/api/v1/reviews", ReviewsRouter.router)
        this.server.app.use("/api/v1/userrestaurantsuggestions", UserRestaurantSuggestionsRouter.router)
        this.server.app.use("/api/v1/mealtypes", MealtypesRoutes.router)
        this.server.app.use("/api/v1/ambiances", AmbianceRoutes.router)
        this.server.app.use("/api/v1/cuisines", CuisinesRoutes.router)
        this.server.app.use("/api/v1/areas", AreasRoutes.router)
        this.server.app.use("/api/v1/restauranttypes", RestauranttypeRoutes.router)
        this.server.app.use("/api/v1/dinningoptions", DinningoptionsRoutes.router)


        //Default Route Must be added at end.
        this.server.app.use('/', DefaultRouter.router);
        this.server.app.use(errorHandler);
    }

    static StartServer(port: number) {
        this.server.httpServer = stoppable(
            this.server.app.listen(port, () => {
                console.log(`Server Started on Port : ${port}`);
            })
        );
        this.server.httpServer.on('close', () => {
            console.log('Server Close Fired');
            process.exit(1);
        });
    }

    static async StopServer() {
        console.log('Stopping Server');
        try {
            if (!this.server) process.exit(1);
            this.server.httpServer.close();
        } catch (error) {
            let err: any = error;
            Sentry.Error(err, 'Error when stopping server of service Auth');
        }
    }
}
