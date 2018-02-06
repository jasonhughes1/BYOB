var request = require('request');
const fs = require('fs');

request('https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?sol=2&api_key=vVkXSH113beoeZFC7jRKhtkE5DdHarYabDtrcMsH', function (error, response, body) {
  const photos = JSON.parse(body).photos.map(photo => {
    return {
      img_src: photo.img_src,
      nasa_id: photo.id,
      sol: photo.sol,
      earth_date: photo.earth_date
    }
  });
  const cameras = JSON.parse(body).photos.map(photo => {
    return {
      nasa_id: photo.camera.id,
      name: photo.camera.name,
      rover_id: photo.camera.rover_id,
      full_name: photo.camera.full_name
    }
  });

  const photoData = JSON.stringify(photos, null, 2);
  const cameraData = JSON.stringify(cameras, null, 2);

  fs.writeFile('./photos-data.json', photoData, 'utf-8', (error) => {
    if(error) {
      console.log(error);
    }
    console.log('File Saved!');
  })

  fs.writeFile('./cameras-data.json', cameraData, 'utf-8', (error) => {
    if(error) {
      console.log(error);
    }
    console.log('File Saved!');
  })
});
