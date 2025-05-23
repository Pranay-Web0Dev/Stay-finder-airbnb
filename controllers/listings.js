const listing = require("../models/listings")

const mapToken = process.env.MAP_TOKEN



module.exports.index = async (req, res) => {
    let allListings = await listing.find({})
    res.render("listing/index", { allListings })
    // res.render("listing/index");   
}

module.exports.renderNewForm = (req, res) => {
    res.render("listing/new.ejs")
}

module.exports.showListing = async (req, res) => {
    let { id } = req.params
    let Listing = await listing.findById(id)
        // need to use nested populate to get author stored in reviews model "path" is used for this
        .populate({
            path: "reviews",
            populate: {
                path: "author"
            }
        })
        .populate("owner")
    if (!Listing) {
        req.flash("error", "listing you requested for does not exist")
        res.redirect("/listings")
    }
    res.render("listing/show", { Listing })
}

module.exports.createListing = async (req, res, next) => {
    const location = req.body.listing.location;
    const response = await fetch(`https://api.maptiler.com/geocoding/${encodeURIComponent(location)}.json?key=${mapToken}&limit=1`);
    const data = await response.json();

    let url = req.file.path
    let filename = req.file.filename
    let newListing = new listing(req.body.listing)
    newListing.owner = req.user._id
    newListing.image = { url, filename }

    newListing.geometry = data.features?.[0]?.geometry;

    let saved = await newListing.save()
    console.log(saved)
    req.flash("success", "listing created sucessfully!")
    res.redirect("/listings")

}

module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params
    let list = await listing.findById(id)
    if (!list) {
        req.flash("error", "listing you requested for does not exist")
        res.redirect("/listings")
    }
    let originalImageUrl = list.image.url
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250")
    res.render("listing/edit", { list, originalImageUrl })
}

module.exports.updateListing = async (req, res, next) => {
    const { id } = req.params;
    const updatedData = req.body.listing;

    const Listing = await listing.findById(id);

    // Check if location was changed
    if (updatedData.location && updatedData.location !== Listing.location) {
        const response = await fetch(`https://api.maptiler.com/geocoding/${encodeURIComponent(updatedData.location)}.json?key=${mapToken}&limit=1`);
        const data = await response.json();

        if (!data.features || data.features.length === 0) {
            req.flash("error", "Could not find geolocation for the new location");
            return res.redirect("back");
        }

        Listing.geometry = data.features[0].geometry;
    }

    // Update other listing details
    Listing.title = updatedData.title;
    Listing.description = updatedData.description;
    Listing.location = updatedData.location;
    Listing.price = updatedData.price;

    // Update image if new one is uploaded
    if (req.file) {
        Listing.image = {
            url: req.file.path,
            filename: req.file.filename
        };
    }

    await Listing.save();

    req.flash("success", "Listing updated successfully!");
    res.redirect(`/listings/${id}`);
};


module.exports.deleteListing = async (req, res) => {
    let { id } = req.params
    let deleting = await listing.findByIdAndDelete(id)
    req.flash("success", "listing deleted sucessfully!")
    res.redirect("/listings")
}