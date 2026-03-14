import passport from "passport";
import {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
} from "../constant/app.constant.js";

import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { prisma } from "../prisma/connect.prisma.js";
import { tokenService } from "../../services/token.service.js";
// var GoogleStrategy = require("passport-google-oauth20").Strategy;

export const initLoginGooglePassport = () => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: "http://localhost:3069/api/auth/google/callback",
      },
      async function (accessTokenGG, refreshTokenGG, profile, cb) {
        const fullName = profile.displayName;
        const googleId = profile.id;
        const email = profile.emails[0].value;
        const isEmailVerified = profile.emails[0].verified;
        const avatar = profile.photos[0].value;

        // console.dir({ accessTokenGG, refreshTokenGG, profile }, { depth: null, color: true });
        console.log({ fullName, googleId, email, isEmailVerified, avatar });
        if (!isEmailVerified) {
          // không hợp lệ
          return cb(new Error("Email chưa verify"), null);
        }

        let userExits = await prisma.users.findUnique({
          where: {
            email: email,
          },
        });

        if (!userExits) {
          userExits = await prisma.users.create({
            data: {
              email: email,
              fullName: fullName,
              googleId: googleId,
              avatar: avatar,
            },
          });
        }

        const accessToken = tokenService.createAccessToken(userExits.id);
        const refreshToken = tokenService.createRefreshToken(userExits.id);

        // hợp lệ
        return cb(null, {
          accessToken: accessToken,
          refreshToken: refreshToken,
        });
      },
    ),
  );
};
