// const express=require('express')
// const app=express();
// const dotenv=require('dotenv');
// const UserRoutes=require("./router/user")
// dotenv.config();
// const cookieparser=require("cookie-parser");
// const PORT=process.env.PORT||4000;


// const database = require('./config/database');
// database.connect();


// //parse in the bopdy
// app.use(express.json());
// app.use(cookieparser()); 
// //routes
// // app.use(
// //     cors({
// //         origin:"http://localhost:3000",
// //         credentials:true,
// //     })
// // )

// //mounts
// app.use("/api/v1/auth",UserRoutes);


// app.get("/",(req,res)=>{
//     return res.json({
//         success:true,
//         message:"i am lucifer and i am running",
//     })
// })
// app.listen(PORT, (err) => {
//     if (err) {
//         console.log(`Error in starting the server: ${err.message}`);
//     } else {
//         console.log(`Server running successfully on port ${PORT}`);
//     }
// });
const express = require("express");
const app = express();
const dotenv = require("dotenv");
const UserRoutes = require("./router/user");
dotenv.config();
const cookieParser = require("cookie-parser");
const PORT = process.env.PORT || 4000;

// Import database connection
const database = require('./config/database');
database.connect();

// Middleware to parse incoming requests
app.use(express.json());  // Parses JSON bodies
app.use(cookieParser());  // For handling cookies

// Routes
app.use("/api/v1/auth", UserRoutes);

// Test endpoint
app.get("/", (req, res) => {
    return res.json({
        success: true,
        message: "Server is running successfully",
    });
});

// Start server
app.listen(PORT, (err) => {
    if (err) {
        console.log(`Error starting server: ${err.message}`);
    } else {
        console.log(`Server running on port ${PORT}`);
    }
});
