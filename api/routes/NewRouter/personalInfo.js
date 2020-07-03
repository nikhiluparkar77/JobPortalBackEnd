const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");
const jwt = require("jsonwebtoken");

const Info = require("../../models/NewModel/personalInfo");
const NewUser = require("../../models/NewModel/NewUser");

router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res, next) => {
    const profile = {};
    profile.userId = req.user.id;
    profile.FirstName = req.body.FirstName;
    profile.LastName = req.body.LastName;
    profile.EmailId = req.body.EmailId;
    profile.Phone = req.body.Phone;
    profile.DateOfBirth = req.body.DateOfBirth;
    profile.CurrentCity = req.body.CurrentCity;
    profile.PermanentAddress = req.body.PermanentAddress;
    profile.State = req.body.State;
    profile.Nationality = req.body.Nationality;

    Info.findOne({ userId: req.user.id })
      .then((proId) => {
        if (proId) {
          return res.status(400).json({ message: "Profile Already avilable" });
        } else {
          return new Info(profile)
            .save()
            .then((response) => res.json(response));
        }
      })
      .catch((err) => res.status(500).json(err));
  }
);

// Get persional info
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res, next) => {
    Info.findOne({ userId: req.user.id })
      .select(
        "_id userId FirstName LastName EmailId Phone DateOfBirth CurrentCity PermanentAddress State Nationality professional educational savejob applyjob"
      )
      .then((result) => {
        if (result) {
          res.status(200).json({
            info: result,
            request: {
              type: "GET",
              url: "http://localhost:5000/personal/" + result._id,
            },
          });
        } else {
          res.status(404).json({
            message: "Not Valid Id Found",
          });
        }
      })
      .catch((err) => {
        res.status(500).json({
          Error: err,
        });
      });
  }
);

router.get(
  "/:infoId",
  passport.authenticate("jwt", { session: false }),
  (req, res, next) => {
    const id = req.params.infoId;
    Info.findById(id)
      .select(
        "_id userId FirstName LastName EmailId Phone DateOfBirth CurrentCity PermanentAddress State Nationality professional educational savejob applyjob"
      )
      .then((result) => {
        if (result) {
          res.status(200).json({
            info: result,
            request: {
              type: "GET",
              url: "http://localhost:5000/personal/" + result._id,
            },
          });
        } else {
          res.status(404).json({
            message: "Not Valid Id Found",
          });
        }
      })
      .catch((err) => {
        res.status(500).json({
          Error: err,
        });
      });
  }
);

// Edit persional info
router.patch("/:infoId", (req, res, next) => {
  const id = req.params.infoId;
  Info.findOneAndUpdate(
    {
      _id: id,
    },
    {
      $set: {
        FirstName: req.body.FirstName,
        LastName: req.body.LastName,
        EmailId: req.body.EmailId,
        Phone: req.body.Phone,
        DateOfBirth: req.body.DateOfBirth,
        CurrentCity: req.body.CurrentCity,
        PermanentAddress: req.body.PermanentAddress,
        State: req.body.State,
        Nationality: req.body.Nationality,
      },
    }
  )
    .exec()
    .then((result) => {
      res.status(200).json({
        message: "Inforamtion Updated",
        request: {
          type: "GET",
          url: "http://localhost:5000/personal/" + id,
        },
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        Error: err,
      });
    });
});

// Delete persional info
// router.delete(
//   "/",
//   passport.authenticate("jwt", { session: false }),
//   (req, res, next) => {
//     Info.findOneAndRemove({ userId: req.user.id })
//       .exec()
//       .then(() => {
//         res.status(200).json({
//           message: "Information Delete Successfully",
//           request: {
//             request: {
//               type: "GET",
//               url: "http://localhost:5000/personal/",
//             },
//           },
//         });
//       })
//       .catch((err) => {
//         res.status(500).json({
//           Error: err,
//         });
//       });
//   }
// );

router.delete(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res, next) => {
    Info.findOneAndDelete({ userId: req.user.id })
      .then(() => {
        NewUser.findOneAndDelete({ _id: req.user.id })
          .then(() => {
            res.json({ message: "User Deleted" });
          })
          .catch((err) => res.status(500).json({ err: err }));
      })
      .catch((err) => res.status(500).json({ err: err }));
  }
);

// Add Profissional info
router.post(
  "/professional/:infoId",
  passport.authenticate("jwt", { session: false }),
  (req, res, next) => {
    const id = req.params.infoId;
    Info.findById(id)
      .then((info) => {
        if (info.professional.length === 0) {
          const pro = {
            Skills: req.body.Skills,
            Company: req.body.Company,
            Position: req.body.Position,
            Experience: req.body.Experience,
          };
          info.professional.unshift(pro);
          return info.save().then((profile) => {
            res.status(200).json(profile);
          });
        } else {
          res.status(500).json({
            message: "Professional Details avilable",
          });
        }
      })
      .catch((err) => {
        res.status(500).json({
          Error: err,
        });
      });
  }
);

// update Profissional info
router.patch(
  "/professional/:proId",
  passport.authenticate("jwt", { session: false }),
  (req, res, next) => {
    const id = req.params.proId;
    Info.findOneAndUpdate(
      {
        _id: id,
      },
      {
        $set: {
          professional: [
            {
              Skills: req.body.Skills,
              Company: req.body.Company,
              Position: req.body.Position,
              Experience: req.body.Experience,
            },
          ],
        },
      }
    )
      .then((info) => {
        res.status(200).json(info);
      })
      .catch((err) => {
        res.status(500).json({
          Error: err,
        });
      });
  }
);

// Delete Profissional info
router.delete(
  "/professional/:infoId",
  passport.authenticate("jwt", { session: false }),
  (req, res, next) => {
    const id = req.params.infoId;
    Info.findById(id)
      .then((info) => {
        const removeIndex = info.professional.map((item) => {
          item._id;
        });
        info.professional.splice(removeIndex, 1);
        return info.save().then((profile) => {
          res.status(200).json(profile);
        });
      })
      .catch((err) => {
        res.status(500).json({
          Error: err,
        });
      });
  }
);

// Add Educational info
router.post(
  "/educational/:infoId",
  passport.authenticate("jwt", { session: false }),
  (req, res, next) => {
    const id = req.params.infoId;
    Info.findById(id)
      .then((info) => {
        if (info.educational.length === 0) {
          const pro = {
            SSCBordName: req.body.SSCBordName,
            SSCYear: req.body.SSCYear,
            SSCPercentage: req.body.SSCPercentage,
            HSCBordName: req.body.HSCBordName,
            HSCYear: req.body.HSCYear,
            HSCPercentage: req.body.HSCPercentage,
            GraduationUniverSity: req.body.GraduationUniverSity,
            GraduationYear: req.body.GraduationYear,
            GraduationPercentage: req.body.GraduationPercentage,
          };
          info.educational.unshift(pro);
          return info.save().then((profile) => {
            res.status(200).json(profile);
          });
        } else {
          return res.status(500).json({
            message: "Educational Details avilable",
          });
        }
      })
      .catch((err) => {
        res.status(500).json({
          Error: err,
        });
      });
  }
);

// update Educational info
router.patch(
  "/educational/:eduId",
  passport.authenticate("jwt", { session: false }),
  (req, res, next) => {
    const id = req.params.eduId;
    Info.findOneAndUpdate(
      {
        _id: id,
      },
      {
        $set: {
          educational: [
            {
              SSCBordName: req.body.SSCBordName,
              SSCYear: req.body.SSCYear,
              SSCPercentage: req.body.SSCPercentage,
              HSCBordName: req.body.HSCBordName,
              HSCYear: req.body.HSCYear,
              HSCPercentage: req.body.HSCPercentage,
              GraduationUniverSity: req.body.GraduationUniverSity,
              GraduationYear: req.body.GraduationYear,
              GraduationPercentage: req.body.GraduationPercentage,
            },
          ],
        },
      }
    )
      .then((info) => {
        res.status(200).json(info);
      })
      .catch((err) => {
        res.status(500).json({
          Error: err,
        });
      });
  }
);

// Delete Profissional info
router.delete(
  "/educational/:infoId",
  passport.authenticate("jwt", { session: false }),
  (req, res, next) => {
    const id = req.params.infoId;
    Info.findById(id)
      .then((info) => {
        const removeIndex = info.educational.map((item) => {
          item._id;
        });
        info.educational.splice(removeIndex, 1);
        info.save().then((profile) => {
          res.status(200).json(profile);
        });
      })
      .catch((err) => {
        res.status(500).json({
          Error: err,
        });
      });
  }
);

// Add SaveJobs
router.post(
  "/savejob",
  passport.authenticate("jwt", { session: false }),
  (req, res, next) => {
    Info.findOne({ userId: req.user.id })
      .then((info) => {
        const saveJobs = {
          jobId: req.body.jobId,
          position: req.body.position,
          company: req.body.company,
          experience: req.body.experience,
        };

        info.savejob.unshift(saveJobs);
        return info.save().then((profile) => {
          res.status(200).json(profile);
        });
      })
      .catch((err) => {
        res.status(500).json({
          Error: err,
        });
      });
  }
);

// Delete SaveJobs
router.delete(
  "/savejob/:save_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Info.findOne({ userId: req.user.id })
      .then((profile) => {
        // Get remove index
        const removeIndex = profile.savejob
          .filter((item) => item.id)
          .indexOf(req.params.save_id);

        // splice Out of array
        profile.savejob.splice(removeIndex, 1);
        profile.save().then((profile) => res.json(profile));
      })
      .catch((err) => res.status(404).json(err));
  }
);

// Add ApplyJobs
router.post(
  "/applyjob",
  passport.authenticate("jwt", { session: false }),
  (req, res, next) => {
    Info.findOne({ userId: req.user.id })
      .then((info) => {
        const applyJobs = {
          jobId: req.body.jobId,
          position: req.body.position,
          company: req.body.company,
          experience: req.body.experience,
          joinDate: req.body.joinDate,
          resinDate: req.body.resinDate,
        };

        info.applyjob.unshift(applyJobs);
        return info.save().then((profile) => {
          res.status(200).json(profile);
        });
      })
      .catch((err) => {
        res.status(500).json({
          Error: err,
        });
      });
  }
);

// Delete ApplyJobs
router.delete(
  "/applyjob/:apply_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Info.findOne({ userId: req.user.id })
      .then((profile) => {
        // Get remove index
        const removeIndex = profile.applyjob
          .filter((item) => item.id)
          .indexOf(req.params.apply_id);

        // splice Out of array
        profile.applyjob.splice(removeIndex, 1);
        profile.save().then((profile) => res.json(profile));
      })
      .catch((err) => res.status(404).json(err));
  }
);

module.exports = router;
