const mongoose=require('mongoose');
require('dotenv').config();
exports.connect=()=>{
    mongoose.connect(process.env.BASE_URL)
    .then(() => console.log("DB connection successful")) 

    .catch((error)=>{
        console.log("error in database");
        console.log(error);
        process.exit(1);
    })
}