const knex = require("../src/db/connection");
const mapProperties = require("../src/utils/map-properties");

function read(id) {
  return knex("reviews")
      .select("*")
      .where({ review_id: id })
      .first();
}

const addCritic = mapProperties({
  c_critic_id: "critic.critic_id",
  preferred_name: "critic.preferred_name",
  surname: "critic.surname",
  organization_name: "critic.organization_name",
  c_created_at: "critic.created_at",
  c_updated_at: "critic.updated_at",
});

function listCritics(review_id) {
  return knex("reviews as r")
      .join("critics as c", "r.critic_id", "c.critic_id")
      .select("r.*", "c.*")
      .where({ "r.review_id": review_id })
      .then((data) => data.map(r => addCritic(r)))
}

function destroy(review_id) {
    return knex("reviews")
      .where({ review_id: review_id })
      .del();
  }

function update(updatedReview) {
  const { review_id } = updatedReview
  return knex("reviews")
      .select("*")
      .where({ review_id })
      .update(updatedReview, "*")
      .then(() => {
      return read(review_id)
  })
      .then(() => listCritics(review_id))
      .then(updatedRecords => updatedRecords[0])
}

module.exports = {
    read,
    destroy,
    update,
}