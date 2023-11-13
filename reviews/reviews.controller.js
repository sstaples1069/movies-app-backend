const service = require("./reviews.service.js");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const mapProperties = require("../src/utils/map-properties");

// check if review exists, if not return 404
async function reviewExists(req, res, next) {
    const review = await service.read(req.params.reviewId);
    if (review) {
      res.locals.review = review;
      return next();
    }
    next({ status: 404, message: `Review cannot be found.` });
}

// CRUD: update a review
async function update(req, res) {
    const updatedReview = {
      ...res.locals.review,
      ...req.body.data,
    };
    const data = await service.update(updatedReview);
    res.json({ data });
}

// CRUD: delete a review using destroy
async function destroy(req, res) {
    await service.destroy(res.locals.review.review_id); 
    res.sendStatus(204);
}

module.exports = {
  reviewExists,
  update: [reviewExists, update],
  delete: [reviewExists, destroy], 
}