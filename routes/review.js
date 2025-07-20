const express= require("express");
const router= express.Router({mergeParams: true});

// ------------------------------------------------------------------------------------
const wrapAsync = require('../utils/wrapAsync.js');

// ------------------------------------------------------------------------------------
const Review= require('../models/review.js');
const {reviewSchema}= require("../schema.js")
// ------------------------------------------------------------------------------------
const ExpressError = require('../utils/ExpressError.js');

// ------------------------------------------------------------------------------------
const Listing = require('../models/listing.js'); 
// ------------------------------------------------------------------------------------
const {isLoggedIn, isReviewAuthor}= require("../middleware.js")

// ------------------------------------------------------------------------------------
const reviewController= require("../controller/reviews.js")

// ------------------------------------------------------------------------------------


const validateReview= (req, res, next) => {
    let {error}=reviewSchema.validate(req.body.review);

    if(error){
        let errMsg= error.details.map((el)=> el.message).join(',');
        throw new ExpressError(400, errMsg);
    }else{
        next();
    }
}

router.post("/", isLoggedIn, validateReview, wrapAsync(reviewController.createReview))


// delete review route

router.delete("/:reviewId",isLoggedIn,isReviewAuthor, wrapAsync(reviewController.deleteReview))


module.exports= router;













