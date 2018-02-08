process.env.NODE_ENV = 'test';

const chai = require('chai');
const should = chai.should('should');
const chaiHttp = require('chai-http');
const server = require('../server');

const knex = require('../db/knex');

chai.use(chaiHttp);

describe('Client Routes', () => {
  afterEach(done => {
    server.close(done);
  });

  it('should return the homepage', () => {
    return chai.request(server)
    .get('/')
    .then(response => {
      response.should.have.status(200);
      response.should.be.html;
    })
    .catch(response => {
      console.log(response);
    })
  });

  it('should return a 404 for a route that does not exist', () => {
    return chai.request(server)
    .get('/nothere!')
    .then(response => {
      console.log(response);
    })
    .catch(response => {
      response.should.have.status(404);
    })
  });
});

describe('JWT authentication', () => {
  afterEach(done => {
    server.close(done);
  });

  it.skip('should GET a JWT token if the user has @turing.io email', () => {

  });

  it.skip('should not return a JWT token to a different email', () => {

  });
});

describe('API Routes', () => {
  beforeEach(done => {
    knex.seed.run()
     .then(() => done())
  });

  afterEach(done => {
    server.close(done);
  });

  const authToken = process.env.BYOB_AUTH_TOKEN;

  describe('GET /api/v1/cameras', () => {
    it('should GET all of the cameras', () => {
      return chai.request(server)
      .get('/api/v1/cameras')
      .then(response => {
        response.should.have.status(200);
        response.should.be.json;
        response.body.cameras.should.be.a('array');
        response.body.cameras[0].should.have.property('name');
        response.body.cameras[0].should.have.property('id');
        response.body.cameras[0].should.have.property('full_name');
        response.body.cameras[0].should.have.property('created_at');
        response.body.cameras[0].should.have.property('updated_at');
      })
      .catch(error => { throw error; })
    });

    it('should return 404 status if the url is mistyped', () => {
      return chai.request(server)
      .get('/api/v1/camras')
      .then(response => {
        console.log(response);
      })
      .catch(response => {
        response.should.have.status(404);
      })
    });
  });

  describe('GET /api/v1/photos', () => {
    it('should GET all of the photos', () => {
      return chai.request(server)
      .get('/api/v1/photos')
      .then(response => {
        response.should.have.status(200);
        response.should.be.json;
        response.body.photos.should.be.a('array');
        response.body.photos[0].should.have.property('id');
        response.body.photos[0].should.have.property('img_src');
        response.body.photos[0].should.have.property('earth_date');
        response.body.photos[0].should.have.property('sol');
        response.body.photos[0].should.have.property('nasa_id');
        response.body.photos[0].should.have.property('cameras_id');
        response.body.photos[0].should.have.property('created_at');
        response.body.photos[0].should.have.property('updated_at');
      })
      .catch(error => { throw error; })
    });

    it('should return 404 status if the url is mistyped', () => {
      return chai.request(server)
      .get('/api/v1/photoss')
      .then(response => {
        console.log(response);
      })
      .catch(response => {
        response.should.have.status(404);
      })
    });
  });

  describe('GET /api/v1/cameras/:cameraID/photos', () => {
    it('should GET photos of specified camera', () => {
      return chai.request(server)
      .get('/api/v1/cameras')
      .then(response => {
        return response.body.cameras[0].id
      })
      .then(id => {
        return chai.request(server)
        .get(`/api/v1/cameras/${id}/photos`)
        .then(response => {
          response.should.have.status(200);
          response.should.be.json;
          response.body.photos.should.be.a('array');
          response.body.photos[0].should.have.property('id');
          response.body.photos[0].should.have.property('img_src');
          response.body.photos[0].should.have.property('earth_date');
          response.body.photos[0].should.have.property('sol');
          response.body.photos[0].should.have.property('nasa_id');
          response.body.photos[0].should.have.property('cameras_id');
          response.body.photos[0].should.have.property('created_at');
          response.body.photos[0].should.have.property('updated_at');
        })
        .catch(error => { throw error; })
      })
    });

    it('should provide error message if camera id does not exist', () => {
      return chai.request(server)
      .get('/api/v1/cameras/10000000/photos')
      .then(response => {
        console.log('response');
      })
      .catch(error => {
        error.response.should.have.status(404);
        error.response.body.should.be.a('object');
        error.response.body.error.should.equal('Did not find photo from camera with id 10000000');
      })
    });

    it('should return 404 status if the url is mistyped', () => {
      return chai.request(server)
      .get('/api/v1/camerass/1/photos')
      .then(response => {
        console.log(response);
      })
      .catch(response => {
        response.should.have.status(404);
      })
    });
  });

  describe('GET /api/v1/photo?nasa_id=[id]', () => {
    it('should GET one photo based on nasa_id', () => {
      return chai.request(server)
      .get('/api/v1/photo?nasa_id=594013')
      .then(response => {
        response.should.be.json;
      })
      .catch(error => { throw error; })
    });

    it('should return error message if no nasa_id query is provided', () => {
      return chai.request(server)
      .get('/api/v1/photo/')
      .then(response => {
        console.log('response');
      })
      .catch(error => {
        error.response.should.have.status(422);
        error.response.body.should.be.a('object');
        error.response.body.error.should.equal('Please input a nasa_id query parameter.');
      })
    });

    it('should return error message if there is no photo with that nasa_id', () => {
      return chai.request(server)
      .get('/api/v1/photo?nasa_id=1')
      .then(response => {
        console.log('response');
      })
      .catch(error => {
        error.response.should.have.status(404);
        error.response.body.should.be.a('object');
        error.response.body.error.should.equal('No photo with nasa_id of 1 was found.');
      })
    });

    it('should return 404 status if the url is mistyped', () => {
      return chai.request(server)
      .get('/api/v1/phoasd')
      .then(response => {
        console.log(response);
      })
      .catch(response => {
        response.should.have.status(404);
      })
    });

  });

  describe('POST /api/v1/cameras', () => {
    it('should POST a new camera', () => {
      return chai.request(server)
      .post('/api/v1/cameras')
      .send({
        name: 'newcam',
        full_name: 'New Camera'
      })
      .then(response => {
        response.should.have.status(201);
        response.should.be.json;
        response.body.should.have.property('id');
      })
      .catch(error => { throw error; })
    });

    it('should return an error message if missing required parameters (full_name)', () => {
      return chai.request(server)
      .post('/api/v1/cameras')
      .send({
        name: 'newcam'
      })
      .then(response => {
        console.log('response');
      })
      .catch(error => {
        error.response.should.have.status(422);
        error.response.body.should.be.a('object');
        error.response.body.error.should.equal('You are missing the required parameter full_name');
      })
    });

    it('should return an error message if missing required parameters (name)', () => {
      return chai.request(server)
      .post('/api/v1/cameras')
      .send({
        full_name: 'New Camera'
      })
      .then(response => {
        console.log('response');
      })
      .catch(error => {
        error.response.should.have.status(422);
        error.response.body.should.be.a('object');
        error.response.body.error.should.equal('You are missing the required parameter name');
      })
    });
  });

  describe('POST /api/v1/photos', () => {
    it('should POST a new photo', () => {
      return chai.request(server)
      .post('/api/v1/photos')
      .send({
        img_src: 'image source',
        earth_date: 'today',
        sol: 12,
        nasa_id: 1
      })
      .then(response => {
        response.should.have.status(201);
        response.should.be.json;
        response.body.should.have.property('id');
      })
      .catch(error => { throw error; })
    });

    it('should return an error message if missing required parameters (earth_date)', () => {
      return chai.request(server)
      .post('/api/v1/photos')
      .send({
        img_src: 'image source',
        sol: 12,
        nasa_id: 1
      })
      .then(response => {
        console.log('response');
      })
      .catch(error => {
        error.response.should.have.status(422);
        error.response.body.should.be.a('object');
        error.response.body.error.should.equal('You are missing the required parameter earth_date');
      })
    });

    it('should return an error message if missing required parameters (img_src)', () => {
      return chai.request(server)
      .post('/api/v1/photos')
      .send({
        earth_date: 'today',
        sol: 12,
        nasa_id: 1
      })
      .then(response => {
        console.log('response');
      })
      .catch(error => {
        error.response.should.have.status(422);
        error.response.body.should.be.a('object');
        error.response.body.error.should.equal('You are missing the required parameter img_src');
      })
    });
  });

  describe('PATCH /api/v1/cameras/:cameraID', () => {
    it('should PATCH a property of a camera (name)', () => {
      return chai.request(server)
      .post('/api/v1/cameras')
      .send({
        name: 'cam',
        full_name: 'Camera To Be Patched'
      })
      .then(response => {
        return response.body.id
      })
      .then(id => {
        return chai.request(server)
        .patch(`/api/v1/cameras/${id}`)
        .send({
          name: 'changed name'
        })
        .then(response => {
          response.should.have.status(201);
          response.body.should.be.a('object');
          response.body.success.should.equal(`Updated camera ${id}'s name.`)
        })
      })
    });

    it('should PATCH a property of a camera (full_name)', () => {
      return chai.request(server)
      .post('/api/v1/cameras')
      .send({
        name: 'cam',
        full_name: 'Camera To Be Patched'
      })
      .then(response => {
        return response.body.id
      })
      .then(id => {
        return chai.request(server)
        .patch(`/api/v1/cameras/${id}`)
        .send({
          full_name: 'CHANGING'
        })
        .then(response => {
          response.should.have.status(201);
          response.body.should.be.a('object');
          response.body.success.should.equal(`Updated camera ${id}'s full_name.`)
        })
      })
    });

    it('should return error message if camera does not exist', () => {
      return chai.request(server)
      .patch('/api/v1/cameras/10000000')
      .send({
        name: 'changed name'
      })
      .then(response => {
        console.log('response');
      })
      .catch(error => {
        error.response.should.have.status(404);
        error.response.body.should.be.a('object');
        error.response.body.error.should.equal('No camera with id 10000000 found.');
      })
    });
    
  });

  describe('PATCH /api/v1/photos/:photoID', () => {
    it('should PATCH a property of a photo (earth_date)', () => {
      return chai.request(server)
      .post('/api/v1/photos')
      .send({
        img_src: 'image source',
        earth_date: 'today',
        sol: 12,
        nasa_id: 1
      })
      .then(response => {
        return response.body.id
      })
      .then(id => {
        return chai.request(server)
        .patch(`/api/v1/photos/${id}`)
        .send({
          earth_date: 'tomorrow'
        })
        .then(response => {
          response.should.have.status(201);
          response.body.should.be.a('object');
          response.body.success.should.equal(`Updated photo ${id}'s earth_date.`)
        })
      })
    });

    it('should PATCH a property of a photo (nasa_id)', () => {
      return chai.request(server)
      .post('/api/v1/photos')
      .send({
        img_src: 'image source',
        earth_date: 'today',
        sol: 12,
        nasa_id: 1
      })
      .then(response => {
        return response.body.id
      })
      .then(id => {
        return chai.request(server)
        .patch(`/api/v1/photos/${id}`)
        .send({
          nasa_id: 123
        })
        .then(response => {
          response.should.have.status(201);
          response.body.should.be.a('object');
          response.body.success.should.equal(`Updated photo ${id}'s nasa_id.`)
        })
      })
    });

    it('should return error message if photo does not exist', () => {
      return chai.request(server)
      .patch('/api/v1/photos/10000000')
      .send({
        earth_date: 1
      })
      .then(response => {
        console.log('response');
      })
      .catch(error => {
        error.response.should.have.status(404);
        error.response.body.should.be.a('object');
        error.response.body.error.should.equal('No photo with id 10000000 found.');
      })
    });
  });

  describe('DELETE /api/v1/cameras/:cameraID', () => {
    it('should DELETE a camera', () => {
      return chai.request(server)
      .post('/api/v1/cameras')
      .send({
        name: 'cam',
        full_name: 'Camera To Be Deleted'
      })
      .then(response => {
        return response.body.id
      })
      .then(id => {
        return chai.request(server)
        .delete(`/api/v1/cameras/${id}`)
        .then(response => {
          response.should.have.status(204);
        })
      })
    });

  });

  describe('DELETE /api/v1/photos/:photoID', () => {
    it('should DELETE a photo', () => {
      return chai.request(server)
      .post('/api/v1/photos')
      .send({
        img_src: 'image source',
        earth_date: 'today',
        sol: 12,
        nasa_id: 1
      })
      .then(response => {
        return response.body.id
      })
      .then(id => {
        return chai.request(server)
        .delete(`/api/v1/photos/${id}`)
        .then(response => {
          response.should.have.status(204);
        })
      })
    });

  });
});