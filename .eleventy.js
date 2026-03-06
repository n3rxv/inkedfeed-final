module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("src/images");
  eleventyConfig.addPassthroughCopy("admin");
  eleventyConfig.addCollection("posts", function (collectionApi) {
    return collectionApi.getFilteredByGlob("src/posts/*.md")
      .filter(post => !post.data.draft);
  });
  eleventyConfig.addCollection("rotatorPosts", function (collectionApi) {
    return collectionApi.getFilteredByGlob("src/posts/*.md")
      .filter(post => post.data.rotator === true && !post.data.draft);
  });

  eleventyConfig.addFilter('autoImage', function(title) {
    const escaped = (title || 'Inkedfeed').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
    const words = escaped.split(' ');
    const lines = [];
    let line = '';
    for(const word of words) {
      if((line + ' ' + word).trim().length > 22) {
        if(line) lines.push(line.trim());
        line = word;
      } else {
        line = (line + ' ' + word).trim();
      }
    }
    if(line) lines.push(line.trim());
    const lineH = 38;
    const totalH = lines.length * lineH;
    const startY = 120 - totalH / 2 + lineH / 2;
    const textEls = lines.map((l, i) =>
      `<text x="50%" y="${startY + i * lineH}" text-anchor="middle" dominant-baseline="middle" font-family="Georgia, serif" font-size="28" font-weight="bold" font-style="italic" fill="#e05a3a">${l}</text>`
    ).join('');
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="240" viewBox="0 0 800 240"><rect width="800" height="240" fill="#000000"/><rect x="0" y="0" width="4" height="240" fill="#e05a3a"/>${textEls}</svg>`;
    return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
  });
  return {
    dir: {
      input: "src",
      includes: "_includes",
      output: "_site"
    }
  };
};
