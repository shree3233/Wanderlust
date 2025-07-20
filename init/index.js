const mongoose = require('mongoose');
const initData= require('./data.js');

const Listing = require('../models/listing.js');

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/Wanderlust');
}

main()
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch((err) => {
        console.error("Error connecting to MongoDB", err);
    });


const initDB= async ()=>{
    await Listing.deleteMany({});
    initData.data= initData.data.map((obj)=>({
        ...obj,
        owner: '6873b804a4c1733fd121dc2b'
    }));
    await Listing.insertMany(initData.data)
    console.log("Database initialized with sample data");
}

initDB();