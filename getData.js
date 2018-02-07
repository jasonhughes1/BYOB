var request = require('request');
const fs = require('fs');

request('https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?sol=1500&api_key=vVkXSH113beoeZFC7jRKhtkE5DdHarYabDtrcMsH', function (error, response, body) {
  const photos = JSON.parse(body).photos.map(photo => {
    return {
      img_src: photo.img_src,
      nasa_id: photo.id,
      sol: photo.sol,
      earth_date: photo.earth_date
    }
  });
  const cameras = JSON.parse(body).photos[0].rover.cameras.map(camera => {
    return {
      name: camera.name,
      full_name: camera.full_name,
      rover_id: 5,
      rover_name: 'Curiosity'
    }
  });

  const photoData = JSON.stringify(photos, null, 2);
  const cameraData = JSON.stringify(cameras, null, 2);

  fs.writeFile('./photos-data.js', photoData, 'utf-8', (error) => {
    if(error) {
      console.log(error);
    }
    console.log('File Saved!');
  })

  fs.writeFile('./cameras-data.js', cameraData, 'utf-8', (error) => {
    if(error) {
      console.log(error);
    }
    console.log('File Saved!');
  })
});
