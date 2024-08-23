import express from "express";
import { Sentry } from "../../server/sentry";


const routes = express.Router();

routes.use((req, res, next) => {
  //   console.log('Health Router Middleware');
  next();
});


//Always Use Default Routes at the End to ensure precedence
routes.get("/", async (req, res) => {
  /**
  * @TODO TAIMOOR
    @REVIEW
  * 1. Check DB Status
  * 2. Check Vault Status
  * 3. CircuitBreakStatus (Optional)
  *
  * If any error occurs sample respone will be
  * { db : false/true , vault : false/true, servicenameStatus : false/true }
  */
  try {


    res.status(200).send({ status: 'OK' });
  } catch (error: any) {
    res.status(500).send(error.toString());
  }
});



export const router = routes;
//HEALTH CHECK IS USED FOR CONNECTION LIKES VAULT IS CONNECTED OR NOT, MONGODB, AWS ETC
//CIRCUIT BREAKER WILL BE USE TO CHECK CONNECTION AMONG SERVICE
//VAULT ROUTER WILL BE USE TO UPDATE VAULT CONFIGS
// console.log("checking initalization of vault", result.initialized); //check vault initalization
// console.log("novigdb connetion creating some issue?",NovigDatabase.db.closed); //check db connection
// if (!result.initialized) connectionObject.vault = false