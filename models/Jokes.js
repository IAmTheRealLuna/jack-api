const mongoose = require("mongoose");

const JokesSchema = mongoose.Schema({
    id: {
        type: String,
        required: true
    },
    joke: {
        type: String,
        required: true
    },
});

module.exports = mongoose.model("Jokes", JokesSchema);
