const express = require('express');
const validate = require('express-validation');
const controller = require('../../controllers/user.controller');
const { authorize } = require('../../middlewares/auth');
const { ADMIN } = require('../../../helpers/role');
const {
  listUsers,
  createUser,
  updateUser,
} = require('../../validations/user.validation');

const router = express.Router();

/**
 * Load user when API with userId route parameter is hit
 */
router.param('userId', controller.load);

// /users - Returns users or create user
router
  .route('/')
  .get(authorize(ADMIN), validate(listUsers), controller.list)
  .post(authorize(ADMIN), validate(createUser), controller.create);


// /users/:userId - Returns a user or update or delete a user
router
  .route('/:userId')
  .get(authorize(ADMIN), controller.get)
  .patch(authorize(ADMIN), validate(updateUser), controller.update)
  .delete(authorize(ADMIN), controller.remove);


module.exports = router;
