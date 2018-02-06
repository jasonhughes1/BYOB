const camerasData = require('../../cameras-data.js');
const photosData = require('../../photos-data.js');

const createCamera = (knex, camera) => {
  return knex('cameras').insert({
    nasa_id: camera.id,
    name: camera.name,
    rover_id: camera.rover_id,
    full_name: camera.full_name
  });
};

const createPhoto = (knex, photo) => {
  return knex('photos').insert({
    img_src: photo.img_src,
    nasa_id: photo.id,
    sol: photo.sol,
    earth_date: photo.earth_date
  });
}

exports.seed = function(knex, Promise) {
  return knex('photos').del()
    .then(() => knex('cameras').del())
    .then(() => {
      let cameraPromises = [];
      let photoPromises = [];

      camerasData.forEach(camera => {
        cameraPromises.push(createCamera(knex, camera));
      });

      photosData.forEach(photo => {
        photoPromises.push(createPhoto(knex, photo));
      });

      return Promise.all([...cameraPromises, ...photoPromises]);
    })
    .then(() => console.log('Seeding complete'))
    .catch(error => console.log(`Error seeding data: ${error}`))
};
