const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({
  extended: true
}));

// Set up conection to the MongoDb.
mongoose.connect("mongodb://localhost:27017/wikiDB", {
  useUnifiedTopology: true,
  useNewUrlParser: true
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("Connected to the mongoDB!");
});
//Article schema.
const articleSchema = {
  title: String,
  content: String
};
//Article model.
const Article = new mongoose.model("Article", articleSchema)

app.get("/", function(req, res) {
  res.send("Hi");
});

app.route("/articles")
  .get(function(req, res) {
    Article.find(function(err, foundArticles) {
      if (!err) {
        res.send(foundArticles);
      } else {
        console.log(err);
      }
    });
  })
  .post(function(req, res) {
    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content
    });
    newArticle.save(function(err) {
      if (!err) {
        res.send("Successfuly added a new articles");
      } else {
        res.send(err);
      }
    });
  })
  .delete(function(req, res) {
    Article.deleteMany(function(err) {
      if (!err) {
        res.send("Successfuly delited all articles");
      } else {
        res.send(err);
      }
    });
  });


app.listen(3000, function(err, res) {
  console.log("Server starting on port 3000");
});
