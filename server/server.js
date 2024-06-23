import dotenv from "dotenv"
import connectDB from "./database/index.js";
import {app} from './app.js'
dotenv.config({
    path: './.env'
})



connectDB()
.then(() => {
    //In an Express.js application, 
    //although it's more common to use middleware for error handling, 
    //using app.on("error") can catch certain types of errors that might not be handled by middleware.
    app.on("error",(error)=>{
        //error that are not handle by middleware can be catched by app.on("error")
        console.log("ERRR: ",error);
        // throw error; think before throwing exception it would crash the whole application
        
    })
    app.listen(process.env.PORT || 8000, () => {
        console.log(`⚙️ Server is running at port : ${process.env.PORT}`);
    })
})
.catch((err) => {
    console.log("MONGO db connection failed !!! ", err);
})


