import chai from "chai";
import chaiHttp from "chai-http";
import {HTTPServer} from "../server/http";

const expect = chai.expect;
chai.use(chaiHttp);

const email = "johndoe@test.com";
let user_id = "";
let token = ""; // Variable to store the token
let device_type = "ios";
let device_token = "DEVICE_TOKEN_HERE";

export async function sampleTests(): Promise<void> {
    describe("Sample Routes", () => {

        describe("POST /login", () => {
            let valid = {
                "client_id": "CLIENT_ID",
                "platform": "facebook",
                "device_type": device_type,
                "device_token": device_token,
                "type": "User",
                "email": email
            };

            it("Social Login Success", (done) => {
                chai
                    .request(HTTPServer.server.app)
                    .post("/api/v1/user/social-login")
                    .send(valid)
                    .end((err, res) => {
                        expect(res).to.have.status(200);
                        expect(res.body.message).to.exist;
                        expect(res.body.data._id).to.exist;
                        expect(res.body.data.token).to.exist;
                        token = res.body.data.token;
                        user_id = res.body.data._id;
                        done();
                    });
            });
        });

        describe("POST /seed", () => {
            it("Invalid Token", (done) => {
                chai
                    .request(HTTPServer.server.app)
                    .post("/api/v1/sample/seed")
                    .end((err, res) => {
                        expect(res).to.have.status(401);
                        expect(res.body.message).to.exist;
                        done();
                    });
            });

            it("Success", (done) => {
                chai
                    .request(HTTPServer.server.app)
                    .post("/api/v1/sample/seed")
                    .set("x-access-token", `${token}`)
                    .end((err, res) => {
                        expect(res).to.have.status(200);
                        expect(res.body.message).to.exist;
                        done();
                    });
            });
        });

        describe("GET /", () => {

            it("Invalid Token", (done) => {
                chai
                    .request(HTTPServer.server.app)
                    .get("/api/v1/sample")
                    .end((err, res) => {
                        expect(res).to.have.status(401);
                        expect(res.body.message).to.exist;
                        done();
                    });
            });

            it("No record found", (done) => {
                chai
                    .request(HTTPServer.server.app)
                    .get("/api/v1/sample?title=647ee3b00581b767964d834b")
                    .set("x-access-token", `${token}`)
                    .end((err, res) => {
                        expect(res).to.have.status(200);
                        expect(res.body.message).to.exist;
                        done();
                    });
            });

            it("Success", (done) => {
                chai
                    .request(HTTPServer.server.app)
                    .get("/api/v1/sample")
                    .set("x-access-token", `${token}`)
                    .end((err, res) => {
                        expect(res).to.have.status(200);
                        expect(res.body.message).to.exist;
                        done();
                    });
            });

            it("Success with pagination", (done) => {
                chai
                    .request(HTTPServer.server.app)
                    .get("/api/v1/music?paginate=1")
                    .set("x-access-token", `${token}`)
                    .end((err, res) => {
                        expect(res).to.have.status(200);
                        expect(res.body.message).to.exist;
                        expect(res.body.data.pagination).to.exist;
                        done();
                    });
            });
        });
    });
}