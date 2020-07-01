const mongoose = require('mongoose');

const jobSchema = mongoose.Schema({
    _id : mongoose.Schema.Types.ObjectId,
    position: {type: String, required: true},
    company: {type: String, required: true},
    opening: {type: Number, required: true},
    experience: {type: String, required: true},
    salary: {type: String, required: true},
    skill: {type: String, required: true},
    location: {type: String, required: true}
})

module.exports = mongoose.model("Jobs", jobSchema)