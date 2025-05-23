const listing = require("./models/listings")
const Review = require("./models/review")
const ExpressError = require("./utility/expressError.js")
const {listingSchema} = require("./schema.js")
const {reviewSchema} = require("./schema.js")



module.exports.isLoggedIn= (req, res, next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl
        req.flash("error", "you must be logged in to create listing")
        res.redirect("/login")
    }
    next()
}


module.exports.saveRedirectUrl = (req,res,next)=>{
    if(req.session.redirectUrl){

        res.locals.redirectUrl =  req.session.redirectUrl
    }
    next()
}

module.exports.isOwner = async (req,res,next)=>{
     let {id} = req.params
    let Listing = await listing.findById(id)
    if(!Listing.owner._id.equals(res.locals.currUser._id)){
        req.flash("error", "access denied")
        // return is used to exit from this path else downside functions will get executed
        return res.redirect(`/listings/${id}`)
    }
    next()
}

module.exports.isReviewAuthor = async (req,res,next)=>{
     let {id,reviewId} = req.params
    let review = await Review.findById(reviewId)
    let Listing = await listing.findById(id)

    if(!review.author._id.equals(res.locals.currUser._id) && !Listing.owner._id.equals(res.locals.currUser._id)){
        req.flash("error", "access denied! only review author or listing creator can delete the review")
        // return is used to exit from this path else downside functions will get executed
        return res.redirect(`/listings/${id}`)
    }
    next()
}

module.exports.validateListing = (req, res, next) =>{
    let {error} = listingSchema.validate(req.body)
            if(error){
                throw new ExpressError(400, error)
            }else{
                next()
            }
}

module.exports.validatereview = (req,res, next) =>{
    let {error} = reviewSchema.validate(req.body)
    if(error){
        throw new ExpressError(400, error)
    }else{
        next()
    }
}