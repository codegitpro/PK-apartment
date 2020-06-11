const mongoose = require('mongoose');
const httpStatus = require('http-status');
const { omitBy, isNil } = require('lodash');
const APIError = require('../utils/APIError');
const User = require('./user.model');

/**
 * Apartment Schema
 * @private
 */
const apartmentSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true
  },
  description: {
    type: String,
    require: true
  },
  size: {
    type: Number,
    require: true,
  },
  price: {
    type: Number,
    require: true
  },
  rooms: {
    type: Number,
    require: true
  },
  location: {
    lat: {
      type: Number,
      require: true
    },
    lng: {
      type: Number,
      require: true
    }
  },
  address: {
    type: String,
    require: true
  },
  realtor: {
    type: mongoose.Types.ObjectId,
    ref: "User"
  }
}, {
  timestamps: true,
});

/**
 * Methods
 */
apartmentSchema.method({

  // Transform apartment data for returning to the response.
  transform() {
    const transformed = {};
    const fields = ['id', 'name', 'description', 'size', 'price', 'rooms', 'location', 'address', 'createdAt'];
    
    // Pick only necessary fields from Apartment schema
    fields.forEach((field) => {
      transformed[field] = this[field];
    });
    // Transform realtor object if exists
    if (this.realtor instanceof User) {
      transformed['realtor'] = this.realtor.transform();
    }

    return transformed;
  },

});

/**
 * Statics
 */
apartmentSchema.statics = {

  /**
   * Get apartment
   *
   * @param {ObjectId} id - The objectId of apartment.
   * @returns {Promise<Trip, APIError>}
   */
  async get(id) {
    try {
      let apartment;

      // Get apartment with apartmentId 
      if (mongoose.Types.ObjectId.isValid(id)) {
        apartment = await this.findById(id).populate("realtor");
      }
      if (apartment) {
        return apartment;
      }

      // Returns error if apartment doesn't exist
      throw new APIError({
        message: 'Apartment does not exist',
        status: httpStatus.NOT_FOUND,
      });
    } catch (error) {
      throw error;
    }
  },


  /**
   * List apartments in descending order of 'createdAt' timestamp.
   *
   * @returns {Promise<User[]>}
   */
  async list({ minSize, maxSize, minPrice, maxPrice, minRooms, maxRooms }) {

    let match = {};

    // Configure match in order to find destination or comment by keyword
    if (minSize || maxSize) {
      let query = {};
      if (minSize) {
        query["$gte"] = parseInt(minSize);
      } 
      if (maxSize) {
        query["$lte"] = parseInt(maxSize);
      }
      match["size"] = query;
    }

    if (minPrice || maxPrice) {
      let query = {};
      if (minPrice) {
        query["$gte"] = parseInt(minPrice);
      } 
      if (maxPrice) {
        query["$lte"] = parseInt(maxPrice);
      }
      match["price"] = query;
    }

    if (minRooms || maxRooms) {
      let query = {};
      if (minRooms) {
        query["$gte"] = parseInt(minRooms);
      } 
      if (maxRooms) {
        query["$lte"] = parseInt(maxRooms);
      }
      match["rooms"] = query;
    }

    // compose mongo aggregate to search trips
    try {
      let aggregate = [
        {
          "$lookup": {
            "from": "users",
            "localField": "realtor",
            "foreignField": "_id",
            "as": "realtor"
          }
        },
        { "$unwind": "$realtor" },
        {
          "$project": {
            "_id": 0,
            "id": "$_id",
            "name": 1,
            "description": 1,
            "size": 1,
            "price": 1,
            "rooms": 1,
            "location": 1,
            "address": 1,
            "createdAt": 1,
            "realtor.id": "$realtor._id",
            "realtor.email": 1,
            "realtor.name": 1
          }
        },
        {
          "$match": match
        },
        { "$sort": { createdAt: 1 }},
      ];

      let apartments = await this.aggregate(aggregate);
      return apartments;
    } catch (error) {
      throw error;
    }

  },

};

/**
 * @typedef Apartment
 */
module.exports = mongoose.model('Apartment', apartmentSchema);
