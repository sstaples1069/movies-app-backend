const service = require("./movies.service.js");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

// check if movie exists, 404 status if not found
async function movieExists (req, res, next) {
  const {movieId} = req.params;
  const movie = await service.read(movieId);
  if (movie) {
    res.locals.movie = movie;
    return next()
  }
  next({
    status: 404,
    message: "movie does not exist"
  })
}

async function read (req, res) {
  const {movieId} = req.params;
  const data = await service.read(movieId);
  res.json({data})
}

// list movies showing = true or false
async function list(req, res, next) {
  const showing = req.query.is_showing
  const data = showing ? await service.showingList() : await service.list();
  res.json({data})
}

async function movieByTheaters(req, res, next) {
  const { movieId } = req.params;
  const allTheaters = await service.movieByTheaters(movieId);
  const time = new Date().toISOString();
  const data = allTheaters.map((theater) => {
    return { ...theater, created_at: time, updated_at: time };
  });
  res.json({ data });
}

// get reviews for a movie, add info from corresponding critic
async function movieByReviewAndCritic(req, res, next) {
  const time = new Date().toISOString();
  const { movieId } = req.params;
  const reviews = await service.movieByReview(movieId);
  const critics = await service.listCritics();
  const data = reviews.map((review) => {
    const critic = {
      critic: critics.find((critic) => critic.critic_id === review.critic_id),
    };
    return { ...review, created_at: time, updated_at: time, ...critic };
  });

  res.json({ data });
}

module.exports = {
  list,
  read: [asyncErrorBoundary(movieExists), read],
  movieByTheaters,
  movieByReviewAndCritic,
};