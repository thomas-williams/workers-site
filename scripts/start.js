const Metalsmith = require("metalsmith");
const markdown = require("metalsmith-markdown");
const layouts = require("metalsmith-layouts");
const collections = require("metalsmith-collections");
const permalinks = require("metalsmith-permalinks");
const handlebars = require("handlebars");
const fs = require("fs");

const path = require("path");
const pwd = path.join(__dirname, "..");

//------Partials Definitions------
// Navigation
handlebars.registerPartial(
  "navigation",
  fs.readFileSync(pwd + "/layouts/partials/navigation.hbs").toString()
);
// Cover
handlebars.registerPartial(
  "cover",
  fs.readFileSync(pwd + "/layouts/partials/cover.hbs").toString()
);
// Bio
handlebars.registerPartial(
  "bio",
  fs.readFileSync(pwd + "/layouts/partials/bio.hbs").toString()
);

// Dev server
const serve = require("metalsmith-serve");
const watch = require("metalsmith-watch");

Metalsmith(pwd)
  .source("src")
  .destination("public")
  .use(
    collections({
      articles: {
        pattern: ["articles/*.md"],
        sortBy: "index",
        reverse: true,
      },
    })
  )
  .use(markdown())
  .use(
    permalinks({
      pattern: ":collection/:title",
    })
  )
  .use(
    layouts({
      engine: "handlebars",
      directory: "./layouts",
      default: "article.html",
      pattern: ["*/*/*html", "*/*html", "*html"],
      partials: {
        navigation: "partials/navigation",
        cover: "partials/navigation",
        bio: "partials/bio",
      },
    })
  )
  .use(
    serve({
      port: 8081,
      verbose: true,
    })
  )
  .use(
    watch({
      paths: {
        "${source}/**/*": "**/*",
        "layouts/**/*": "**/*",
      },
    })
  )
  .build(function (err) {
    if (err) {
      console.error(err);
    } else {
      console.log("build completed!");
    }
  });
