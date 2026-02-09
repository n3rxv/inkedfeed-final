module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("src/images");
  eleventyConfig.addPassthroughCopy("admin");
  eleventyConfig.addCollection("posts", function (collectionApi) {
    return collectionApi.getFilteredByGlob("src/posts/*.md");
  });
  eleventyConfig.addCollection("rotatorPosts", function (collectionApi) {
    return collectionApi.getFilteredByGlob("src/posts/*.md")
      .filter(post => post.data.rotator === true);
  });

  return {
    dir: {
      input: "src",
      includes: "_includes",
      output: "_site"
    }
  };
};
