const httpStatus = require('http-status');
const Apartment = require('../models/apartment.model');

/**
 * Load appartment from appartmentId and append to req.
 * @public
 */
exports.load = async (req, res, next, id) => {
  try {
    const apartment = await Apartment.get(id);
    req.locals = { apartment };
    return next();
  } catch (error) {
    return next(error);
  }   
};

/**
 * Get apartment
 * @public
 */
exports.get = (req, res) => res.json(req.locals.apartment.transform());


/**
 * Create new apartment
 * @public
 */
exports.create = async (req, res, next) => {
  try {
    const apartment = new Apartment(req.body);
    apartment.realtor = req.user;
    const savedApartment = await apartment.save();
    res.status(httpStatus.CREATED);
    res.json(savedApartment.transform());
  } catch (error) {
    next(error);
  }
};


/**
 * Update existing apartment
 * @public
 */
exports.update = (req, res, next) => {
  const apartmentData = req.body;
  const apartment = Object.assign(req.locals.apartment, apartmentData);
  
  apartment.save()
    .then(savedApartment => res.json(savedApartment.transform()))
    .catch(e => next(e));
};

/**
 * Get apartment list
 * @public
 */
exports.list = async (req, res, next) => {
  try {
    let apartments = await Apartment.list({ ...req.query });
    res.json(apartments);
  } catch (error) {
    next(error);
  }
};

/**
 * Delete apartment
 * @public
 */
exports.remove = (req, res, next) => {
  const { apartment } = req.locals;

  apartment.remove()
    .then(() => res.status(httpStatus.NO_CONTENT).end())
    .catch(e => next(e));
};
