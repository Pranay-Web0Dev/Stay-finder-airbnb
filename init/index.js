const mongoose = require("mongoose")
const listing = require("../models/listings.js")
const initData = require("./data.js")

main().then(()=>{
    console.log("Connected to MongoDB")
}).catch((err)=>{
    console.log(err)
})

async function main(){
    await mongoose.connect("mongodb://localhost:27017/stay_finder")
}


const initDB = async ()=>{
    await listing.deleteMany({})
    initData.data = initData.data.map((obj)=>({...obj, owner:"6824cd74908bf0b3732d1920"}))
    await listing.insertMany(initData.data)
    console.log("data was initialized")
}

initDB()