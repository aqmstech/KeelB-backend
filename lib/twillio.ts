import {Application} from "../app";

export abstract class TwilioLibrary{

    public static async createRoom(roomName = null) {
        try {

            const duration = 86400   // 24 hours in seconds
            // const accountSid =Application.conf.TWILIO.accountSid;
            // const authToken=Application.conf.TWILIO.authToken
            const {accountSid,authToken} = Application.conf.TWILIO
            const client = require('twilio')(accountSid, authToken);

            return await client.video.v1.rooms.create({
                uniqueName: roomName,
                type: 'group',
                recordParticipantsOnConnect: false,
            }).then((room: any) => {
                // console.log(room)
                return room;
            });
        } catch (error) {
            // this.errorApiResponse(error.message, 500, 1035)
            throw new Error(error.message)
        }
    };

    public static async fetchRoom(roomName = null) {
        try {
            console.log(roomName,"roomName")
            const {accountSid,authToken} = Application.conf.TWILIO
            console.log(accountSid,authToken,"accountSid,authToken")
            const client = require('twilio')(accountSid, authToken);

            return await client.video.v1.rooms(roomName)
                .fetch()
                .then((room: any) => {
                    return room
                });
        } catch (error) {
            throw new Error(error.message)
        }
    };

    public static async generateTokenTwilio(user_id:any,videoRoom:any) {

        let twilioRoom:any = await this.fetchRoom(videoRoom)

        return await this.getAccessToken(user_id, twilioRoom.sid)
    }

    public static async getAccessToken(input:any, roomName:any) {

        const Twilio = require("twilio")
        const AccessToken = Twilio.jwt.AccessToken;
        // const ChatGrant = AccessToken.ChatGrant;
        const VideoGrant = AccessToken.VideoGrant;

        const {accountSid,apiKey, secretKey} = Application.conf.TWILIO
        // const accountSid ='ACeba1e1e9965596df3fa9f5157368dc56';
        // const apiKey='SK910478ef0da82a9435a5d2812bb6914a'
        // const secretKey='ar7qmof3NzgFMcHTmjnBdOQl50Hxifpf'
        const identity = input;

        const videoGrant = new VideoGrant({room: roomName});

        const token = new AccessToken(
            accountSid,
            apiKey,
            secretKey,
            {identity: identity}
        );

        token.addGrant(videoGrant);

        return token.toJwt();
    }
}