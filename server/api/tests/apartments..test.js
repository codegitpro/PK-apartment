/* eslint-disable arrow-body-style */
/* eslint-disable no-unused-expressions */
const request = require('supertest');
const httpStatus = require('http-status');
const { expect } = require('chai');
const sinon = require('sinon');
const bcrypt = require('bcryptjs');
const { some, omitBy, isNil } = require('lodash');
const mongoose = require('mongoose');
const app = require('../../index');
const User = require('../models/user.model');
const Apartment = require('../models/apartment.model');

describe('Apartments API', () => {
  let adminAccessToken;
  let realtorAccessToken;
  let clientAccessToken;
  let dbUsers;
  let user;

  const password = '123456';
  

  beforeEach(async () => {
    const passwordHashed = await bcrypt.hash(password, 1);
    dbUsers = {
      admin: {
        email: 'admin@yahoo.com',
        password: passwordHashed,
        name: 'Joel Bradley',
        role: 'admin',
      },
      realtor: {
        email: 'nathan@gmail.com',
        password: passwordHashed,
        name: 'Nathan Murray',
        role: 'realtor'
      },
      client: {
        email: 'tyree@gmail.com',
        password: passwordHashed,
        name: 'Tyree Kaufman',
        role: 'client'
      }
    };

    dbApartments = {
      california: {
        name: "California Apartment",
	      description: "Best apartment in california",
	      size: 120,
	      price: 402, 
	      rooms: 5,
        location: {
    	    lat: 35.358243,
    	    lng: -119.1207586
        },
        address: "10300-10498 Hinderhill Dr, Bakersfield, CA 93312, USA"
      },
      washington: {
        name: "Washington Apartment",
	      description: "Apartment with beautiful view",
	      size: 149,
	      price: 6488, 
	      rooms: 7,
        location: {
    	    lat: 47.668476,
    	    lng: -117.3501402
        },
        address: "1115 N Havana St Spokane, WA 99202 USA"
      }
    },

    apartment = {
      name: "Gunarama Wholesale",
	      description: "Ready for sale",
	      size: 149,
	      price: 6488, 
	      rooms: 7,
        location: {
    	    lat: 47.668476,
    	    lng: -117.3501402
        },
        address: "4111 E Mission Ave Spokane, WA 99202 USA"
    };

    await User.deleteMany({});
    await Apartment.deleteMany({});

    await User.insertMany([dbUsers.admin, dbUsers.realtor, dbUsers.client]);
    dbUsers.admin.password = password;
    dbUsers.realtor.password = password;
    dbUsers.client.password = password;

    adminAccessToken = (await User.findAndGenerateToken(dbUsers.admin)).accessToken;
    realtorAccessToken = (await User.findAndGenerateToken(dbUsers.realtor)).accessToken;
    clientAccessToken = (await User.findAndGenerateToken(dbUsers.client)).accessToken;
    
    realtorId = (await User.findOne({ email: dbUsers.realtor.email }))._id;

    await Apartment.insertMany([
      { ...dbApartments.california, realtor: realtorId }, 
      { ...dbApartments.washington, realtor: realtorId }, 
    ]);

    californiaId = (await Apartment.findOne({ name: dbApartments.california.name }))._id;

  });

  describe('POST /v1/apartments', () => {
    it('should create a new apartment when request is ok', () => {
      return request(app)
        .post('/v1/apartments')
        .set('Authorization', `Bearer ${realtorAccessToken}`)
        .send(apartment)
        .expect(httpStatus.CREATED)
        .then((res) => {
          expect(res.body).to.deep.include(apartment);
        });
    });

    it('should report error when name is not provided', () => {
      delete apartment.name;

      return request(app)
        .post('/v1/apartments')
        .set('Authorization', `Bearer ${realtorAccessToken}`)
        .send(apartment)
        .expect(httpStatus.BAD_REQUEST)
        .then((res) => {
          const { field } = res.body.errors[0];
          const { location } = res.body.errors[0];
          const { messages } = res.body.errors[0];
          expect(field).to.be.equal('name');
          expect(location).to.be.equal('body');
          expect(messages).to.include('"name" is required');
        });
    });

    it('should report error when description is not provided', () => {
      delete apartment.description;

      return request(app)
        .post('/v1/apartments')
        .set('Authorization', `Bearer ${realtorAccessToken}`)
        .send(apartment)
        .expect(httpStatus.BAD_REQUEST)
        .then((res) => {
          const { field } = res.body.errors[0];
          const { location } = res.body.errors[0];
          const { messages } = res.body.errors[0];
          expect(field).to.be.equal('description');
          expect(location).to.be.equal('body');
          expect(messages).to.include('"description" is required');
        });
    });


    it('should report error when size is not provided', () => {
      delete apartment.size;

      return request(app)
        .post('/v1/apartments')
        .set('Authorization', `Bearer ${realtorAccessToken}`)
        .send(apartment)
        .expect(httpStatus.BAD_REQUEST)
        .then((res) => {
          const { field } = res.body.errors[0];
          const { location } = res.body.errors[0];
          const { messages } = res.body.errors[0];
          expect(field).to.be.equal('size');
          expect(location).to.be.equal('body');
          expect(messages).to.include('"size" is required');
        });
    });


    it('should report error when price is not provided', () => {
      delete apartment.price;

      return request(app)
        .post('/v1/apartments')
        .set('Authorization', `Bearer ${realtorAccessToken}`)
        .send(apartment)
        .expect(httpStatus.BAD_REQUEST)
        .then((res) => {
          const { field } = res.body.errors[0];
          const { location } = res.body.errors[0];
          const { messages } = res.body.errors[0];
          expect(field).to.be.equal('price');
          expect(location).to.be.equal('body');
          expect(messages).to.include('"price" is required');
        });
    });


    it('should report error when rooms is not provided', () => {
      delete apartment.rooms;

      return request(app)
        .post('/v1/apartments')
        .set('Authorization', `Bearer ${realtorAccessToken}`)
        .send(apartment)
        .expect(httpStatus.BAD_REQUEST)
        .then((res) => {
          const { field } = res.body.errors[0];
          const { location } = res.body.errors[0];
          const { messages } = res.body.errors[0];
          expect(field).to.be.equal('rooms');
          expect(location).to.be.equal('body');
          expect(messages).to.include('"rooms" is required');
        });
    });

    it('should report error when address is not provided', () => {
      delete apartment.address;

      return request(app)
        .post('/v1/apartments')
        .set('Authorization', `Bearer ${realtorAccessToken}`)
        .send(apartment)
        .expect(httpStatus.BAD_REQUEST)
        .then((res) => {
          const { field } = res.body.errors[0];
          const { location } = res.body.errors[0];
          const { messages } = res.body.errors[0];
          expect(field).to.be.equal('address');
          expect(location).to.be.equal('body');
          expect(messages).to.include('"address" is required');
        });
    });


    it('should report error when logged user is not an admin or realtor', () => {
      return request(app)
        .post('/v1/apartments')
        .set('Authorization', `Bearer ${clientAccessToken}`)
        .send(user)
        .expect(httpStatus.FORBIDDEN)
        .then((res) => {
          expect(res.body.code).to.be.equal(httpStatus.FORBIDDEN);
          expect(res.body.message).to.be.equal('You don\'t have permission.');
        });
    });
  });

  describe('GET /v1/apartments', () => {
    it('should get all apartments', () => {
      return request(app)
        .get('/v1/apartments')
        .set('Authorization', `Bearer ${clientAccessToken}`)
        .expect(httpStatus.OK)
        .then(async (res) => {

          const includesCalifornia = some(res.body, dbApartments.california);
          const includesWashington = some(res.body, dbApartments.washington);

          expect(res.body).to.be.an('array');
          expect(res.body).to.have.lengthOf(2);
          expect(includesCalifornia).to.be.true;
          expect(includesWashington).to.be.true;
        });
    });
  });

  describe('GET /v1/apartments/:apartmentId', () => {
    it('should get apartment', async () => {
      return request(app)
        .get(`/v1/apartments/${californiaId}`)
        .set('Authorization', `Bearer ${realtorAccessToken}`)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body).to.deep.include(dbApartments.california);
        });
    });

    it('should report error "Apartment does not exist" when apartment does not exists', () => {
      return request(app)
        .get('/v1/apartments/56c787ccc67fc16ccc1a5e92')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .expect(httpStatus.NOT_FOUND)
        .then((res) => {
          expect(res.body.code).to.be.equal(404);
          expect(res.body.message).to.be.equal('Apartment does not exist');
        });
    });


  });

  describe('PATCH /v1/apartments/:apartmentId', () => {
    it('should update apartment', async () => {

      return request(app)
        .patch(`/v1/apartments/${californiaId}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(apartment)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body).to.deep.include(apartment);
        });
    });

    it('should report error "Apartment does not exist" when user does not exists', () => {
      return request(app)
        .patch('/v1/apartments/tstapartment')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .expect(httpStatus.NOT_FOUND)
        .then((res) => {
          expect(res.body.code).to.be.equal(404);
          expect(res.body.message).to.be.equal('Apartment does not exist');
        });
    });

    it('should report error when logged user is not an admin or realtor', () => {
      return request(app)
        .post('/v1/apartments')
        .set('Authorization', `Bearer ${clientAccessToken}`)
        .send(apartment)
        .expect(httpStatus.FORBIDDEN)
        .then((res) => {
          expect(res.body.code).to.be.equal(httpStatus.FORBIDDEN);
          expect(res.body.message).to.be.equal('You don\'t have permission.');
        });
    });
  });

  describe('DELETE /v1/apartments', () => {
    it('should delete apartment', async () => {
      return request(app)
        .delete(`/v1/apartments/${californiaId}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .expect(httpStatus.NO_CONTENT)
        .then(() => request(app).get('/v1/apartments'))
        .then(async () => {
          const apartments = await Apartment.find({});
          expect(apartments).to.have.lengthOf(1);
        });
    });

    it('should report error "Apartment does not exist" when user does not exists', () => {
      return request(app)
        .delete('/v1/apartments/testapartment')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .expect(httpStatus.NOT_FOUND)
        .then((res) => {
          expect(res.body.code).to.be.equal(404);
          expect(res.body.message).to.be.equal('Apartment does not exist');
        });
    });

    it('should report error when logged user is not an admin or realtor', async () => {
      return request(app)
        .delete(`/v1/apartments/${californiaId}`)
        .set('Authorization', `Bearer ${clientAccessToken}`)
        .send(apartment)
        .expect(httpStatus.FORBIDDEN)
        .then((res) => {
          expect(res.body.code).to.be.equal(httpStatus.FORBIDDEN);
          expect(res.body.message).to.be.equal('You don\'t have permission.');
        });
    });
  });

});