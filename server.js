const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const jwt = require('jsonwebtoken');

const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];

const database = require('knex')(configuration);

const secretKey = process.env.BYOB_SECRET_KEY;

app.set('port', process.env.PORT || 3000);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

const requireHTTPS = (req, res, next) => {
  if (req.headers['x-forwarded-proto'] != 'https') {
    return res.redirect('https://' + req.get('host') + req.rul);
  }
  next();
};

const checkAuth = (request, response, next) => {
  const requestToken = request.headers.token;

  if (!requestToken) {
    return response.status(403).json({ error: 'You must be authorized to hit this endpoint.' });
  }

  jwt.verify(requestToken, secretKey, (error, decoded) => {
    if (error) {
      return response.status(403).json({ error: 'Please send a valid token.' })
    } else {
      next();
    }
  });

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
    .then(cameras => {
      return response.status(200).json({ cameras });
    })
    .catch(error => {
      return response.status(500).json({ error })
    })
});

//get all photos
app.get('/api/v1/photos', (request, response) => {
  database('photos').select()
  .then(photos => {
    return response.status(200).json({ photos });
  })
  .catch(error => {
    return response.status(500).json({ error })
  })
})

//get photos based on camera ID
app.get('/api/v1/cameras/:camerasID/photos', (request, response) => {
  const { camerasID } = request.params;
  database('photos').where('cameras_id', camerasID).select()
    .then(photos => {
      if(photos.length) {
        return response.status(200).json({ photos })
      } else {
        return response.status(404).json({
          error: `Did not find photo from camera with id ${camerasID}`
        })
      }
    })
    .catch(error => {
      return response.status(500).json({ error })
    })
});

// specific get request with nasa_id paramater
app.get('/api/v1/photo/', (request, response) => {
  const { nasa_id } = request.query;

  if (!nasa_id) {
    return response.status(422).json({error: 'Please input a nasa_id query parameter.'})
  }

  database('photos').where('nasa_id', nasa_id).select()
    .then(photo => {
      if (photo[0]) {
        return response.status(200).json({ photo: photo[0] });
      } else {
        return response.status(404).json({ error: `No photo with id of ${nasa_id} was found.`})
      }
    })
    .catch(error => {
      return response.status(500).json({ error });
    })
});
 
// send JWT token based on request.body
app.post('/api/v1/authenticate', (request, response) => {
  const token = jwt.sign(request.body, secretKey);
  response.status(200).json({ token });
});

//create a camera with new unique id
app.post('/api/v1/cameras', checkAuth, (request, response) => {
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
app.post('/api/v1/photos', checkAuth, (request, response) => {
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
