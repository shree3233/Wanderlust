const Review= require("../models/review")
const Listing= require("../models/listing")

module.exports.createReview=async (req, res)=>{
    let listing= await Listing.findById(req.params.id);
    let newReview= new Review(req.body.review);

    console.log(req.body.review);
    newReview.author= req.user._id
    listing.reviews.push(newReview._id);
    await newReview.save();
    await listing.save();
    req.flash("success", "New Review Added");
    res.redirect(`/listings/${listing._id}`)
}


module.exports.deleteReview= async (req, res)=>{
    let {id, reviewId}= req.params;

    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}}) //it wii update the listing where reviews arreay is present, then the id of the list is passed and then the review if is pulled (thet is removed) from yhe array
    await Review.findByIdAndDelete(reviewId)
    req.flash("success", "Review Deleted");
    res.redirect(`/listings/${id}`)
}











