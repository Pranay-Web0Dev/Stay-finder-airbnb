const express = require("express")
const router = express.Router({mergeParams:true})
const wrapAsync = require("../utility/wrapAsync.js")
const {validatereview, isLoggedIn, isReviewAuthor} = require("../middleware.js")
const reviewController = require("../controllers/reviews.js")


//post review route
router.post("/",isLoggedIn, validatereview,wrapAsync(reviewController.createReview ))

//delete review route
router.delete("/:reviewId",isLoggedIn, isReviewAuthor,wrapAsync(reviewController.destroyReview))

module.exports = router