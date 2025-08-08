import express from 'express';
import dotenv from 'dotenv';
import connectDb from './config/db.js';
import userRoutes from './routes/userRoutes.js';
import cors from 'cors';

import session from 'express-session';
import './config/passport.js';
import passport from 'passport';
import MongoStore from 'connect-mongo';

dotenv.config();
const app = express();
app.set('trust proxy', 1);
app.use(cors({
    origin: ['https://moscodedev.github.io','http://localhost:5173'],
    credentials: true,
}));

app.use(express.json());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store:MongoStore.create({
        mongoUrl: process.env.MONGO_DB,
        collectionName: 'sessions',
    }),
    cookie: {
        secure: false,
        sameSite: 'lax',
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 
    }
}))
    app.use(passport.initialize());
    app.use(passport.session());



const PORT = process.env.PORT || 3000;

const startServer = async()=>{
    try {
        await connectDb(process.env.MONGO_DB);
        app.use('/api/users', userRoutes);
        app.listen(PORT,()=> console.log('Server is running on port 3000'));
        
    } catch (error) {
        console.log("failed to connect to database", error);
        process.exit(1);
        
    }
};

startServer();
