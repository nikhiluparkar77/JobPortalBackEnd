const express = require('express');
const router = express.Router(); 
const mongoose = require('mongoose');


const Jobs = require('../../models/NewModel/jobs');

router.get('/', (req, res, next) => {
    Jobs.find()
        .select('position company opening experience salary skill location _id')
        .exec()
        .then( result => {
            const response = {
                count: result.length,
                jobs: result.map(reslt => {
                    return{
                        position: reslt.position,
                        company: reslt.company,
                        opening: reslt.opening,
                        experience: reslt.experience,
                        salary: reslt.salary,
                        skill: reslt.skill,
                        location: reslt.location,
                        _id: reslt._id,
                        request:{
                            type: "GET",
                            url: "http://localhost:5000/job/" + reslt._id
                        }
                    }
                })
            }
            res.status(200).json(response);
        })
        .catch(err => {
            res.status(500).json({
                Error: err
            })
        })    
})

router.get('/:jobId', (req, res, next) =>{
    const id = req.params.jobId;
    Jobs.findById(id)
        .select('position company opening experience salary skill location _id')
        .exec()
        .then(result =>{
            if(result){
                res.status(200).json({
                    job: result,
                    request: {
                        type:"GET",
                        url: "http://localhost:5000/job/" + result._id
                    }
                })
            }else{
                res.status(404).json({
                    message: "Not Valid Id Found"
                })
            }
        })
        .catch(err => {
            res.status(500).json({
                Error:err
            })
        })
     
})

router.post('/', (req, res, next) =>{ 
    const jobs = new Jobs({
        _id: new mongoose.Types.ObjectId(),
        position: req.body.position,
        company: req.body.company,
        opening: req.body.opening,
        experience: req.body.experience,
        salary: req.body.salary,
        skill: req.body.skill,
        location: req.body.location
    });
 
    jobs.save() 
        .then(result => {
            if(result.length >= 1){
                res.status(409).json({
                    message: "Post Already Avilable"
                })
            }else{
                res.status(201).json({
                    message:"Listing Succesfully",
                    jobListing:{
                        id: result._id,
                        position: result.position,
                        company: result.company,
                        opening: result.opening,
                        experience: result.experience,
                        salary: result.salary,
                        skill: result.salary,
                        location: result.location
                    }
                })
            }
            
        })
        .catch(err =>{
            res.status(500).json({
                Error:err
            })
        });
})


router.patch('/:jobId', (req, res, next) => {
    const id = req.params.jobId;
    const updateOps = {};
    for(const ops of req.body){
        updateOps[ops.propName] = ops.value;
    } 
    Jobs.update({
      _id: id  
    },
    { 
        $set:updateOps
    })
    .exec()
    .then(result => { 
        res.status(200).json({
            message: "Job Updated",
            request:{
                type: 'GET',
                url: 'http://localhost:5000/job/' + id
            }
        })
    })
    .catch( err => {
        console.log(err);
        res.status(500).json({
            Error:err
        })
    })
})


router.delete('/:jobId', (req, res, next) => {
    const id = req.params.jobId;
    Jobs.remove({
        _id: id
    })
    .exec()
    .then( result => {
        res.status(200).json({
            message: "Job Deleted",
            request:{
                type : 'POST',
                url: 'http://localhost:5000/jobs',
                body:{
                    position: 'String',
                    company: 'String',
                    opening: 'Number',
                    experience: 'String',
                    salary: 'String',
                    skill: 'String',
                    location: 'String',
                }
            }
        })
    })
    .catch( err => {
        res.status(500).json({
            Error:err
        })
    })
})

module.exports = router;
