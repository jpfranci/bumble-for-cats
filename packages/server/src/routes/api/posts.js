const express = require("express");
const router = express.Router();
const operations = require("../../data/db/db-operations/post-ops");

router.get("/", async function (req, res, next) {
  let posts;
  try {
    if (req.query !== {}) {
      posts = await operations.getPostsByFilter(req);
    } else {
      posts = await operations.getPosts();
    }
    res.json(posts);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
