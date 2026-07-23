import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';

const clientID = process.env.GOOGLE_CLIENT_ID;
const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
const callbackURL = process.env.GOOGLE_CALLBACK_URL || 'http://localhost:3000/api/auth/google/callback';

if (clientID && clientSecret) {
  passport.use(
    new GoogleStrategy(
      {
        clientID,
        clientSecret,
        callbackURL,
      },
      (accessToken, refreshToken, profile, done) => {
        done(null, profile);
      }
    )
  );
} else {
  console.warn('[Passport] GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET is missing. Google OAuth strategy disabled.');
}

export default passport;
