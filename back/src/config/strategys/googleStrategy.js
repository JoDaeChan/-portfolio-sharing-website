const GoogleStrategy = require("passport-google-oauth20").Strategy;
import { User } from "../../db";

const config = {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_SECRET,
};
async function findOrCreateUser({ name, email }) {
    const user = await User.findByEmail({ email });
    if (user) {
        return user;
    }
    const created = await User.create({
        name,
        email,
        password: "GOOGLE_OAUTH",
    });
    return created;
}

/** @description 현재 구현만 되어 있고 프론트와 연동x */
const google = new GoogleStrategy(
    config,
    async (accessToken, refreshToken, profile, done) => {
        const { email, name } = profile._json;

        try {
            const user = await findOrCreateUser({ email, name });
            done(null, {
                _id: user._id,
                email: user.email,
                name: user.name,
            });
        } catch (e) {
            done(e, null);
        }
    },
);

module.exports = google;
