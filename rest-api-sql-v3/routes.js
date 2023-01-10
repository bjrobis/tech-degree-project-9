'use strict';

const express = require('express');
const { asyncHandler } = require('./middleware/async-handler');
const { Course, User } = require('./models');
const {authenticateUser} = require('./middleware/auth-user');

// Construct a router instance.
const router = express.Router();

//GET Route: Return all Users
router.get('/users', authenticateUser, asyncHandler(async (req, res) => {
    const users = await User.findAll();
    res.status(200).json(users);
  }));

//POST: creates a new user.
router.post('/users', asyncHandler(async (req, res) => {
    try {
        if (req.body.firstName && req.body.lastName && req.body.emailAddress && req.body.password) {  
            await User.create(req.body);
            res.status(201).setHeader("location", "/");
        } 
    } catch (error) {
        if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
          const errors = error.errors.map(err => err.message);
          res.status(400).json({ errors });   
        } else {
          throw error;
        }
      }
    }));

//GET: All courses including the users associated with each course
router.get('/courses', asyncHandler(async (req, res) => {
        const courses = await Course.findAll();
        res.status(200).json(courses);
  }));

//GET: Return the corresponding course including the User associated with that course
router.get('/courses/:id', asyncHandler(async (req, res) => {
    const course = await Course.findByPk(req.params.id);
    res.status(200).json(course);
  }));

//POST: creates a new course
router.post('/courses', authenticateUser, asyncHandler(async (req, res) => {
    await Course.create(req.body);
    if (req.body.title && req.body.description) {
        const newCourse = await Course.findOne({where: {title: req.body.title}});
        const id = newCourse.id;
        res.status(201).setHeader("location", `/courses/${id}`);
    } else {
        res.status(400).json({message: error.message});
    }
  }));

//PUT: updates course
router.put('/courses/:id', authenticateUser, asyncHandler(async (req, res) => {
    const course = await Course.findByPk(req.params.id);
    if (course && req.body.title && req.body.description) {
        if (req.body.title) {
            course.title = req.body.title;
        }
        if (req.body.description) {
            course.description  = req.body.description;
        }
        if (req.body.id) {
            course.id  = req.body.id;
        }
        if (req.body.estimatedTime) {
            course.estimatedTime  = req.body.estimatedTime;
        }
        if (req.body.materialsNeeded) {
            course.description  = req.body.description;
        }
        if (req.body.userID) {
            course.userID  = req.body.userID;
        }
         
        await save(course);
        //204 indicates that the update went as expected 
        //end method tells express that we are done (need to end if you aren't sending data back)
        res.status(204).end();
    } else {
        res.status(400).json({message: error.message});
    }
  }));

//DELETE: deletes the corresponding course
router.delete('/courses/:id', authenticateUser, asyncHandler(async (req, res) => {
    const courses =  await Course.findAll();
    courses = courses.filter(item => item.id != req.params.id);
    await save(courses);
    res.status(204).end();
}));


module.exports = router;