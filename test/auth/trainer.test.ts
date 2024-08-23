import chai from "chai";
import chaiHttp from "chai-http";
import { HTTPServer } from "../../server/http";
import { ObjectId } from "mongodb";

const expect = chai.expect;
chai.use(chaiHttp);

let otp = "0000";
let token = "";
let user_id = "";
const email = "johndoe@test.com";
const user_password = "";
let device_type = "ios";
let device_token = "DEVICE_TOKEN_HERE";
let service_id = "";

export async function trainerTests(): Promise<void> {
    describe("Trainer Routes", () => {

        describe("POST /register", () => {

            let signup_data = {
                "full_name":"John Doe",
                "password": user_password,
                "password_confirmation": user_password,
                "address": "test",
                "gender": "Male",
                "dob": "1990-01-10",
                "device_token": device_token,
                "device_type": device_type,
                "type": "Trainer",
                "image": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTIkXpYZbqBhf7cHjjQ1_OnF0DuO7FeS522JM4EsLwEx5c-KXQGSg4_W1krYgvOfQJezco&usqp=CAU",
                "license": [
                    {
                        "path": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTIkXpYZbqBhf7cHjjQ1_OnF0DuO7FeS522JM4EsLwEx5c-KXQGSg4_W1krYgvOfQJezco&usqp=CAU",
                        "mime_type": "image",
                        "type": 90,
                        "is_feature": false
                    }
                ],
                "is_license_verified": "true"
            };

            let successfull_signup_data = {...signup_data, email: email};

            it("Signup Validation Error", (done) => {
                chai
                .request(HTTPServer.server.app)
                .post("/api/v1/user/register")
                .send(signup_data)
                .end((err, res) => {
                    expect(res).to.have.status(422);
                    expect(res.body.message).to.exist;
                    done();
                });
            });

            it("Signup successfull", (done) => {
                chai
                .request(HTTPServer.server.app)
                .post("/api/v1/user/register")
                .send(successfull_signup_data)
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body.data._id).to.exist;
                    expect(res.body.message).to.exist;
                    done();
                });
            });
        });

        describe("POST /login (before verify user)", () => {

            let login_data = {
                "email": email,
                "password": user_password
            };

            it("Login Validation Error", (done) => {
                chai
                .request(HTTPServer.server.app)
                .post("/api/v1/user/login")
                .send({})
                .end((err, res) => {
                    expect(res).to.have.status(422);
                    expect(res.body.message).to.exist;
                    done();
                });
            });

            it("Login before verify User", (done) => {
                chai
                .request(HTTPServer.server.app)
                .post("/api/v1/user/login")
                .send(login_data)
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body.message).to.exist;
                    expect(res.body.data.is_verified).to.be.equal(false);
                    done();
                });
            });
        });

        describe("POST /verify-otp", () => {

            let verify_data = {
                "email": email,
                "otp": "das78",
                "type": "signUp"
            };

            it("Validation Error", (done) => {
                chai
                .request(HTTPServer.server.app)
                .post("/api/v1/user/verify-otp")
                .send(verify_data)
                .end((err, res) => {
                    expect(res).to.have.status(422);
                    expect(res.body.message).to.exist;
                    done();
                });
            });

            it("Verify Otp Success", (done) => {
                console.log(`OTP: ${otp}`);
                chai
                .request(HTTPServer.server.app)
                .post("/api/v1/user/verify-otp")
                .send({"email": email, "otp": otp, "type": "signUp"})
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body.message).to.exist;
                    done();
                });
            });
        });

        describe("POST /login", () => {
            it("logs in successfully and returns a token", (done) => {
                chai
                .request(HTTPServer.server.app)
                .post("/api/v1/user/login")
                .send({ email: email, password: user_password }) // Replace with actual username and password
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body.data._id).to.exist;
                    expect(res.body.data.token).to.exist;
                    token = res.body.data.token; // Store the token for subsequent API calls
                    user_id = res.body.data._id;
                    done();
                });
            });
        });

        describe("GET /profile/:id", () => {

            it("Profile not found", (done) => {
                chai
                .request(HTTPServer.server.app)
                .get(`/api/v1/user/profile/${new ObjectId()}`)
                .set('x-access-token', token)
                .end((err, res) => {
                    expect(res).to.have.status(404);
                    expect(res.body.message).to.exist;
                    done();
                });
            });

            it("Profile Success", (done) => {
                chai
                .request(HTTPServer.server.app)
                .get(`/api/v1/user/profile/${user_id}`)
                .set('x-access-token', token)
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body.message).to.exist;
                    done();
                });
            });
        });

        it("Get Services for type Coach", (done) => {
        chai
            .request(HTTPServer.server.app)
            .get("/api/v1/service?type=Coach")
            .end((err, res) => {
            expect(res).to.have.status(200);
            expect(res.body.message).to.exist;
            expect(res.body.data[0]._id).to.exist;
            service_id = res.body.data[0]._id;
            done();
            });
        });

        describe("PUT /profile/:id", () => {

            let profile_data = {
                "type": "Coach",
                "services": [
                    {
                        "service_id": service_id
                    }
                ],
                "bio": "Testing BIO Text Dummy",
                "location": "Test Location",
                "latitude": "24.678",
                "longitude": "67.484"
            };

            it("Update profile without auth token", (done) => {
                chai
                .request(HTTPServer.server.app)
                .put(`/api/v1/user/trainer-profile/${user_id}`)
                .send(profile_data)
                .end((err, res) => {
                    expect(res).to.have.status(401);
                    expect(res.body.message).to.exist;
                    done();
                });
            });

            it("Update Profile Validation Error", (done) => {
                chai
                .request(HTTPServer.server.app)
                .put(`/api/v1/user/trainer-profile/${user_id}`)
                .set('x-access-token', token)
                .send({})
                .end((err, res) => {
                    expect(res).to.have.status(422);
                    expect(res.body.message).to.exist;
                    done();
                });
            });

            it("Profile not found", (done) => {
                chai
                .request(HTTPServer.server.app)
                .put(`/api/v1/user/trainer-profile/${new ObjectId()}`)
                .set('x-access-token', token)
                .send({
                    "type": "Coach",
                    "services": [
                        {
                            "service_id": service_id
                        }
                    ],
                    "bio": "Testing BIO Text Dummy",
                    "location": "Test Location",
                    "latitude": "24.678",
                    "longitude": "67.484"
                })
                .end((err, res) => {
                    expect(res).to.have.status(404);
                    expect(res.body.message).to.exist;
                    done();
                });
            });

            it("Update profile successfull", (done) => {
                chai
                .request(HTTPServer.server.app)
                .put(`/api/v1/user/trainer-profile/${user_id}`)
                .set('x-access-token', token)
                .send({
                    "type": "Coach",
                    "services": [
                        {
                            "service_id": service_id
                        }
                    ],
                    "bio": "Testing BIO Text Dummy",
                    "location": "Test Location",
                    "latitude": "24.678",
                    "longitude": "67.484"
                })
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body.data._id).to.exist;
                    expect(res.body.message).to.exist;
                    done();
                });
            });
        });

        describe("POST /logout", () => {
            it("Logout without auth token", (done) => {
                chai
                .request(HTTPServer.server.app)
                .post("/api/v1/user/logout")
                .end((err, res) => {
                    expect(res).to.have.status(401);
                    expect(res.body.message).to.exist;
                    done();
                });
            });
            
            it("Logout Validation Error", (done) => {
                chai
                .request(HTTPServer.server.app)
                .post("/api/v1/user/logout")
                .set("x-access-token", token)
                .end((err, res) => {
                    expect(res).to.have.status(422);
                    expect(res.body.message).to.exist;
                    done();
                });
            });
            
            it("Logout Success", (done) => {
                chai
                .request(HTTPServer.server.app)
                .post("/api/v1/user/logout")
                .set("x-access-token", token)
                .send({device_type, device_token})
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body.message).to.exist;
                    token = "";
                    done();
                });
            });
        });

        describe("POST /logout", () => {
            it("Forgot Password Validation errors", (done) => {
                chai
                .request(HTTPServer.server.app)
                .post("/api/v1/user/forgot-password")
                .end((err, res) => {
                    expect(res).to.have.status(422);
                    expect(res.body.message).to.exist;
                    done();
                });
            });

            it("Forgot Password Invalid Email", (done) => {
                chai
                .request(HTTPServer.server.app)
                .post("/api/v1/user/forgot-password")
                .send({"email": "invalid_email@test.com"})
                .end((err, res) => {
                    expect(res).to.have.status(404);
                    expect(res.body.message).to.exist;
                    done();
                });
            });

            it("Forgot Password Success", (done) => {
                chai
                .request(HTTPServer.server.app)
                .post("/api/v1/user/forgot-password")
                .send({email})
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body.message).to.exist;
                    done();
                });
            });
        });

        describe("POST /verify-otp (Forgot Password)", () => {

            let verify_data = {
                "email": email,
                "otp": "das78",
                "type": "forgotPassword"
            };

            it("Validation Error", (done) => {
                chai
                .request(HTTPServer.server.app)
                .post("/api/v1/user/verify-otp")
                .send(verify_data)
                .end((err, res) => {
                    expect(res).to.have.status(422);
                    expect(res.body.message).to.exist;
                    done();
                });
            });

            it("Verify Otp Success", (done) => {
                console.log(`OTP: ${otp}`);
                chai
                .request(HTTPServer.server.app)
                .post("/api/v1/user/verify-otp")
                .send({"email": email, "otp": otp, "type": "forgotPassword"})
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body.message).to.exist;
                    done();
                });
            });
        });

        describe("POST /reset-password", () => {

            let valid = {
                "email": email,
                "password": user_password,
                "password_confirmation": user_password
            };

            let invalid = {
                "email": "john@doe.com",
                "password": user_password,
                "password_confirmation": user_password
            };

            let invalid_password = {
                "email": email,
                "password": user_password,
                "password_confirmation": user_password
            };

            it("Validation Error", (done) => {
                chai
                .request(HTTPServer.server.app)
                .post("/api/v1/user/reset-password")
                .end((err, res) => {
                    expect(res).to.have.status(422);
                    expect(res.body.message).to.exist;
                    done();
                });
            });

            it("Password Mismatch", (done) => {
                chai
                .request(HTTPServer.server.app)
                .post("/api/v1/user/reset-password")
                .send(invalid_password)
                .end((err, res) => {
                    expect(res).to.have.status(422);
                    expect(res.body.message).to.exist;
                    done();
                });
            });

            it("Email not found", (done) => {
                chai
                .request(HTTPServer.server.app)
                .post("/api/v1/user/reset-password")
                .send(invalid)
                .end((err, res) => {
                    expect(res).to.have.status(404);
                    expect(res.body.message).to.exist;
                    done();
                });
            });

            it("Reset Password Success", (done) => {
                chai
                .request(HTTPServer.server.app)
                .post("/api/v1/user/reset-password")
                .send(valid)
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body.message).to.exist;
                    done();
                });
            });
        });

        describe("POST /social-login", () => {

            let valid = {
                "client_id": "CLIENT_ID_TRAINER",
                "platform": "facebook",
                "device_type": device_type,
                "device_token": device_token,
                "type": "Trainer",
                "email": email,
                "license": [
                    {
                        "path": "https://google.com",
                        "mime_type": "image",
                        "type": 90,
                        "is_feature": false
                    }
                ],
                "is_license_verified": "true",
            };

            it("Validation Error", (done) => {
                chai
                .request(HTTPServer.server.app)
                .post("/api/v1/user/social-login")
                .end((err, res) => {
                    expect(res).to.have.status(422);
                    expect(res.body.message).to.exist;
                    done();
                });
            });

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
    });
}