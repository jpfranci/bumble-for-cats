const Post = require("../../models/post-model");

// We don't want to send all 1000 posts to the client while we have no filters,
// so this will just sample randomly from all posts
const getPosts = () => {
  return Post.aggregate([{ $sample: { size: 50 } }]);
};

const createPost = async (post) => {
  const createdPost = await Post.create(post);
  return createdPost.toObject();
};

const getPostsByFilter = async ({
  lon,
  lat,
  tagFilter,
  sortType,
  showMatureContent,
}) => {
  const aggregationPipeline = [];
  aggregationPipeline.push({
    $geoNear: {
      near: { type: "Point", coordinates: [lon, lat] },
      key: "location",
      distanceField: "distance",
      minDistance: 0,
      maxDistance: 1500,
    },
  });
  if (tagFilter) {
    aggregationPipeline.push({
      $match: {
        tag: tagFilter,
      },
    });
  }
  if (!showMatureContent) {
    aggregationPipeline.push({ $match: { isMature: false } });
  }
  aggregationPipeline.push({
    $project: {
      title: true,
      body: true,
      date: true,
      numUpvotes: true,
      numDownvotes: true,
      username: true,
      tag: true,
      score: { $subtract: ["$numUpvotes", "$numDownvotes"] },
      isMature: true,
    },
  });
  aggregationPipeline.push({
    // additional arguments are to break ties
    $sort:
      sortType === "popular"
        ? { score: -1, date: -1, _id: -1 }
        : { date: -1, _id: -1 },
  });
  return Post.aggregate(aggregationPipeline);
};

const getPostByID = async (id) => {
  return await Post.findById(id);
};

const operations = {
  getPosts,
  getPostsByFilter,
  createPost,
  getPostByID,
};

module.exports = operations;
