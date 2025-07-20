const joi = require('joi');

module.exports.listingSchema = joi.object({
  title: joi.string().required(),
  description: joi.string().required(),
  price: joi.number().min(0).required(),
  location: joi.string().required(),
  country: joi.string().required(),
  image: joi.string().allow("", null) // optional
});


module.exports.reviewSchema = joi.object({
  rating: joi.number().required().min(1).max(5),
  comment: joi.string().required()
  // optional
});


