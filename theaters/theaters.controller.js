const service = require("./theaters.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

// list all the theaters
async function list(req, res) {
  res.json({ data: await service.list() });
}

module.exports = {
    list,
}