const listing = require("../models/listings")
const review = require("../models/review")

module.exports.createReview = async(req,res)=>{
    let {id} = req.params
    let Listing = await listing.findById(id)
    let newreview =  new review(req.body.review)
    newreview.author = req.user._id
    Listing.reviews.push(newreview)
    await newreview.save()
    await Listing.save()
    console.log("new review saved")
    // res.send("new review saved")
    req.flash("success", "review created sucessfully!")
    res.redirect(`/listings/${id}`)
}

module.exports.destroyReview = async(req,res)=>{
    let {id, reviewId}= req.params
    await listing.findByIdAndUpdate(id, {$pull:{reviews : reviewId}})
    await review.findByIdAndDelete(reviewId)
    req.flash("success", "review deleted sucessfully!")
    res.redirect(`/listings/${id}`)
}