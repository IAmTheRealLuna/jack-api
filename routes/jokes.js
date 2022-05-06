const express = require("express");
const Jokes = require("../models/Jokes")
const router = express.Router();

// Get Request
router.get('/', (req, res) => {
  Jokes.countDocuments().exec(function (err, count) {
    Jokes.findOne().skip(Math.floor(Math.random() * count)).exec(
        function (err, result) {
          res.send(result)
        })
  })
});

// Post Request
router.post('/', (req, res) => {
  const jokes = new Jokes({
    id: req.body.id,
    joke: req.body.joke
  });

  // JSON Time
 jokes.save()
      .then(data => {
        res.json(data);
      })
      .catch(err => {
        res.json({message: err});
      });
});

// Exporting to app.js
module.exports = router;
