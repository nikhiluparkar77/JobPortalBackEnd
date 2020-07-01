const mongoose = require("mongoose");
const InfoSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "NewUser",
    required: true,
  },
  FirstName: { type: String },
  LastName: { type: String },
  EmailId: { type: String },
  Phone: { type: String },
  DateOfBirth: { type: String },
  CurrentCity: { type: String },
  PermanentAddress: { type: String },
  State: { type: String },
  Nationality: { type: String },
  professional: [
    {
      Skills: { type: String },
      Company: { type: String },
      Position: { type: String },
      Experience: { type: String },
    },
  ],
  educational: [
    {
      SSCBordName: { type: String },
      SSCYear: { type: String },
      SSCPercentage: { type: String },
      HSCBordName: { type: String },
      HSCYear: { type: String },
      HSCPercentage: { type: String },
      GraduationUniverSity: { type: String },
      GraduationYear: { type: String },
      GraduationPercentage: { type: String },
    },
  ],
  savejob: [
    {
      jobId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Jobs",
        required: true,
      },
      position: { type: String },
      company: { type: String },
      experience: { type: String },
      date: { type: Date, default: Date.now },
    },
  ],
  applyjob: [
    {
      jobId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Jobs",
        required: true,
      },
      position: { type: String },
      company: { type: String },
      experience: { type: String },
      joinDate: { type: Date },
      resinDate: { type: Date },
      date: { type: Date, default: Date.now },
    },
  ],
});

module.exports = mongoose.model("Info", InfoSchema);
