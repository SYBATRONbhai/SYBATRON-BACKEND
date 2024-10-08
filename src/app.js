import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';


const app = express();

app.use(cors({
    origin : process.env.CORS_ORIGIN,
    credentials: true
}));

app.use(express.json({
    limit : "16kb",
}));

app.use(express.urlencoded({
    extended: true,
    limit : "16kb",
}
));

app.use(express.static("Public"));

app.use(cookieParser());

//routes import
import userRouter from "./Routes/user.Routes.js";


// router declarations

app.use("/api/v1/users", userRouter);

export default app;

// Start the server