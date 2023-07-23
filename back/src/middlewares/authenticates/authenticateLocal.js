import passport from "passport";
import { generateToken } from "../../utils/generateToken";

/** @description local 전략을 사용해 사용자를 인증하고 JWT 토큰 발급 */
const authenticateLocal = (req, res, next) => {
    passport.authenticate("local", { session: false }, (err, user, info) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.status(401).json({ message: info.message });
        }
        const payload = { user_id: user._id };
        const secretKey = process.env.JWT_SECRET_KEY || "jwt-secret-key";
        const expiresIn = process.env.JWT_ACCESS_TOKEN_EXPIRES;
        const token = generateToken(payload, secretKey, expiresIn);

        req.user = user;
        req.token = token;
        next();
    })(req, res, next);
};

module.exports = authenticateLocal;
