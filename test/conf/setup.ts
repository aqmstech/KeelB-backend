import {MongoMemoryServer} from "mongodb-memory-server";
import {Application} from "../../app";
import {Environment} from "../../interfaces/environment";
import chai from "chai";
import mocha from "mocha";
import chaiHttp from "chai-http";
// import {SampleTests} from "../sampleTest.test";

const fs = require("fs");

const expect = chai.expect;
chai.use(chaiHttp);

let mongo: any;
let application: Application;

before(async () => {
    mongo = await MongoMemoryServer.create();
    const mongoUri = await mongo.getUri();
    const port = extractPortFromUri(mongoUri);

    application = new Application();
    let env: Environment = JSON.parse(
        (
            await fs.readFileSync(process.cwd() + `/environments/environment.json`)
        ).toString()
    );
    await application.INIT(env, true, {
        dbname: "DB-NAME",
        host: "127.0.0.1",
        port: port.toString(),
    });
});

function extractPortFromUri(uri: any) {
    const matches = uri.match(/:(\d+)\//);
    if (matches && matches.length > 1) {
        return matches[1];
    }
    return null;
}

after(async () => {
    await mongo.stop();
});

describe("All Tests", () => {
    it("should run all the tests", async function () {
        this.timeout(9000);
        // SampleTests();
    });
});