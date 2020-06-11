const express = require('express');
const validate = require('express-validation');
const controller = require('../../controllers/apartment.controller');
const { authorize } = require('../../middlewares/auth');
const { ADMIN, REALTOR, CLIENT } = require('../../../helpers/role');
const router = express.Router();
const {
  createApartment,
  updateApartment
} = require('../../validations/apartment.validation');

/**
 * Load user when API with userId route parameter is hit
 */
router.param('apartmentId', controller.load);

// /apartments - Returns the apartments or create a apartment
router
  .route('/')
  .get(authorize(), controller.list)
  .post(authorize(ADMIN, REALTOR), validate(createApartment), controller.create);

// /apartments/:apartmentId - Returns a apartment or modify or delete the apartment
router
  .route('/:apartmentId')
  .get(authorize(), controller.get)
  .patch(authorize(ADMIN, REALTOR), validate(updateApartment), controller.update)
  .delete(authorize(ADMIN, REALTOR), controller.remove);


module.exports = router;
