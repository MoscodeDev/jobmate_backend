import passport from "passport";
import {Strategy as LocalStrategy} from "passport-local";
import User from '../models/users.models.js';
import bcrypt from 'bcryptjs';

passport.use(new LocalStrategy(
    {usernameField: 'email'}, async(email, password, done) =>{
        try {
            const user = await User.findOne({email});
            if(!user) return done(null, false, {message: "User not found"});
            const isMatch = await bcrypt.compare(password, user.password);
            if(!isMatch) return done(null, false, {message: "Invalid credentials"});
            // const user = {_id: res._id, name: res.name, email: res.email, role: res.role, createdAt: res.createdAt, updatedAt: res.updatedAt}
            return done(null, user);
        } catch (error) {
            return done(error);
        }
    }
));

passport.serializeUser((user, done) => {
    done(null, user._id);
});

passport.deserializeUser(async(id,done)=>{
    try {
        const res = await User.findById(id);
        const user = {_id: res._id, name: res.name, email: res.email, role: res.role, createdAt: res.createdAt, updatedAt: res.updatedAt}
        done(null, user);
    } catch (error) {
        done(error);
        
    }
})