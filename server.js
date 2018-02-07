const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];

const database = require('knex')(configuration);

app.set('port', process.env.PORT || 3000);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

const requireHTTPS = (req, res, next) => {
  if (req.headers['x-forwarded-proto'] != 'https') {
    return res.redirect('https://' + req.get('host') + req.rul);
  }
  next();
};

app.locals.title = 'BYOB';

app.listen(app.get('port'), () => {

})

app.get('/', (request, response) => {
  return response.send('curiosity')
})

//get all cameras
app.get('/api/v1/cameras', (request, response) => {
  database('cameras').select()
    .then(projects => {
      return response.status(200).json({ projects });
    })
    .catch(error => {
      return response.status(500).json({ error })
    })
});

//get all photos
app.get('/api/v1/photos', (request, response) => {
  database('photos').select()
  .then(projects => {
    return response.status(200).json({ projects });
  })
  .catch(error => {
    return response.status(500).json({ error })
  })
})

//get photos based on camera ID
app.get('/api/v1/cameras/:camerasID/photo', (request, response) => {
  const { camerasID } = request.params;
  database('photo').where('cameras_id', camerasID).select()
    .then(photo => {
      if(photo.length) {
        return response.status(200).json({ photo })
      } else {
        return response.status(404).json({
          error: `Did not find photo from camera with id ${camerasID}`
        })
      }
    })
    .catch(error => {
      return reponse.status(500).json({ error })
    })
})

//create a camera with new unique id
app.post('/api/v1/cameras', (request, response) => {
  const cameras = request.body;

  for(let requiredParameter of ['name']) {
    if(!cameras[requiredParameter]) {
      return response.status(422).json({
        error: `You are missing the required parameter ${requiredParameter}`
      })
    }
  }
  database('cameras').insert(cameras, 'id')
    .then(cameras => {
      return response.status(201).json({ id: cameras[0]})
    })
    .catch(error => {
      return response.status(500).json({ error })
    })
})

//create a photo with new unique id
app.post('/api/v1/photos', (request, response) => {
  const photos = request.body;

  for(let requiredParameter of ['earth_date']) {
    if(!photos[requiredParameter]) {
      return response.status(422).json({
        error: `You are missing the required parameter ${requiredParameter}`
      })
    }
  }
  database('photos').insert(photos, 'id')
    .then(photos => {
      return response.status(201).json({ id: photos[0]})
    })
    .catch(error => {
      return response.status(500).json({ error })
    })
})
