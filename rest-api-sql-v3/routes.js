'use strict';

const express = require('express');
const { asyncHandler } = require('./middleware/async-handler');
const { Course, User } = require('./models');
const {authenticateUser} = require('./middleware/auth-user');

// Construct a router instance.
const router = express.Router();

//GET Route: Return current user
router.get('/users', authenticateUser, asyncHandler(async (req, res) => {
    let currentUser = req.currentUser;
    res.status(200).json({
      firstName: currentUser.firstName,
      lastName: currentUser.lastName,
      emailAddress: currentUser.emailAddress,
      id: currentUser.id
    });
  }));

//POST: creates a new user.
router.post('/users', asyncHandler(async (req, res) => {
    try {
        if (req.body.firstName && req.body.lastName && req.body.emailAddress && req.body.password) {  
            await User.create(req.body);
            res.status(201).setHeader("location", "/").json();
        } else {
            res.status(400).json({message: "The following data is required: FirstName, LastName, Email, and Password"});
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
        const courses = await Course.findAll({
          include: [
            {
              model: User,
              attributes: ['firstName', 'lastName', 'emailAddress'],
            }
          ],
          attributes: ['id', 'title', 'description', 'materialsNeeded', 'userId'],
        });
        res.status(200).json(courses);
  }));

//GET: Return the corresponding course including the User associated with that course
router.get('/courses/:id', asyncHandler(async (req, res) => {
    let course = await Course.findByPk(req.params.id, {
      include: [
        {
          model: User,
          attributes: ['firstName', 'lastName', 'emailAddress'],
        }
      ],
      attributes: ['id', 'title', 'description', 'materialsNeeded', 'userId'],
    });
    res.status(200).json(course);
  }));

//POST: creates a new course
router.post('/courses', authenticateUser, asyncHandler(async (req, res) => {
    try{
      await Course.create(req.body);
      if (req.body.title && req.body.description) {
          const newCourse = await Course.findOne({where: {title: req.body.title}});
          const id = newCourse.id;
          res.status(201).setHeader("location", `/courses/${id}`).end();
      } else {
          res.status(400).json({message: error.message});
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

//PUT: updates course
router.put('/courses/:id', authenticateUser, asyncHandler(async (req, res) => {
    try { 
      let course = await Course.findByPk(req.params.id);
      const currentUserId = req.currentUser.id;
      if (currentUserId === course.userId) {
          await course.update(req.body);
          res.status(204).json();
      } else {
          res.status(403).json({message: 'Denied: You do not own this course'});
      }

    }  catch (error) {
        if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
          const errors = error.errors.map(err => err.message);
          res.status(400).json({ errors });   
        } else {
          throw error;
        }
      }
  }));

//DELETE: deletes the corresponding course
router.delete('/courses/:id', authenticateUser, asyncHandler(async (req, res) => {
    const currentUserId = req.currentUser.id;
    try {
      let course = await Course.findByPk(req.params.id);
      if (course) {
        if (currentUserId === course.userId) {
          await course.destroy();
          res.status(204).json();
      } else {
          res.status(403).json({message: 'Denied: You do not own this course'});
        }
      } else {
        res.status(404).json({message: 'Course does not exist. Please select a valid course.'});
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


module.exports = router;