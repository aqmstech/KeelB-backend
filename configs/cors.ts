import cors from "cors";

export abstract class CorsConfig {

    public static confs = {
        "default": {

            optionsSuccessStatus : 200,
            methods : ["GET","POST","HEAD","OPTION","PATCH","DELETE"],
            origin : ["http://localhost:3000"]

        } as cors.CorsOptions,
        "testroute": {

        } as cors.CorsOptions
    }
}

