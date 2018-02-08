const camerasData = require('../../../data/cameras-data.js');
const photosData = require('../../../data/photos-data.js');

const createCamera = (knex, camera) => {
  return knex('cameras').insert({
    name: camera.name,
    full_name: camera.full_name,
    rover_id: camera.rover_id
    // rover_name: camera.rover_name
  });
};

const createPhoto = (knex, photo) => {
  return knex('cameras').where('name', photo.camera_name).first()
  .then(cameraRecord => {
    return knex('photos').insert({
      img_src: photo.img_src,
      nasa_id: photo.nasa_id,
      sol: photo.sol,
      earth_date: photo.earth_date,
      cameras_id: cameraRecord.id
    });
  })
}

exports.seed = function(knex, Promise) {
  return knex('photos').del()
    .then(() => knex('cameras').del())
    .then(() => {
      let cameraPromises = [];

      camerasData.forEach(camera => {
        cameraPromises.push(createCamera(knex, camera));
      });
      return Promise.all(cameraPromises);
    })
    .then(()=> {

      let photoPromises = [];

      photosData.forEach(photo => {
        photoPromises.push(createPhoto(knex, photo));
      });

      return Promise.all(photoPromises);
    })
    .then(() => console.log('Seeding complete'))
    .catch(error => console.log(`Error seeding data: ${error}`))
};
