const express = require("express")
const router = express.Router()


const wrapAsync = require("../utility/wrapAsync.js")
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js")

const listingController = require("../controllers/listings.js")

const multer = require('multer')
const { storage } = require("../cloudConfig.js")
const upload = multer({ storage })


// all listings
router.get("/", wrapAsync(listingController.index))

// creating new listing
router.get("/new", isLoggedIn, listingController.renderNewForm)

router.post("/",
    isLoggedIn,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.createListing))


// editing the listing
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm))

router.put("/:id",
    isLoggedIn,
    isOwner,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.updateListing))

// deleting the listing
router.delete("/:id", isLoggedIn, isOwner, wrapAsync(listingController.deleteListing))

// show listing
router.get("/:id", wrapAsync(listingController.showListing))


module.exports = router