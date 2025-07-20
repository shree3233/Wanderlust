const mongoose= require('mongoose');
const review = require('./review');
const user= require("./user.js")

const { ref } = require('joi');

const Schema= mongoose.Schema;

const Review=require('./review.js')

const User=require('./user.js')


const listingSchema= new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        filename: {
         type: String,
         default: 'default-filename'
        },
        url: {
        type: String,
        default: 'https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg',
        set: (v) => v === "" ? 'https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg' : v
    }
},
    price: {
        type: Number,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    reviews:[
        {
            type: Schema.Types.ObjectId,
            ref: "Review"
         }
    ],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    category: {
        type: String,
        enum: ['Beach', 'Mountain', 'City', 'Countryside', 'Poolside', 'Bar', 'Sports', 'Lake'],
        required: true
    }
})


listingSchema.post("findOneAndDelete", async (listing)=>{
    if(listing){
        await Review.deleteMany({_id: {$in: listing.reviews}})
    }
})



const Listing= mongoose.model('Listing', listingSchema);

// module.exports= Listing;

module.exports= Listing;
