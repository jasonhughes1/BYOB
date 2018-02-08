const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const jwt = require('jsonwebtoken');
const path = require('path');

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
  if (environment !== 'test') {
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
  } else {
    next();
  }
};

app.locals.title = 'BYOB';

const httpServer = app.listen(app.get('port'), () => {
console.log(`byob running on ${app.get('port')}`);
});

app.use(express.static(path.join(__dirname, 'public')));


// send JWT token based on request.body
app.post('/api/v1/authenticate', (request, response) => {
  const { email, appName } = request.body;

  if(!email || !appName) {
    return response.status(422).json({
      error: `Missing email, app name, or both!`,
    });
  }
  const admin = email.includes('@turing.io');
  if(admin){
    const token = jwt.sign({ admin }, secretKey);
    return response.status(201).json({ token });
  } else {
    return response.status(422).json({ error: `${email} is not a turing email address` })
  }
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
        return response.status(404).json({ error: `No photo with nasa_id of ${nasa_id} was found.`})
      }
    })
    .catch(error => {
      return response.status(500).json({ error });
    })
});


//create a camera with new unique id
app.post('/api/v1/cameras', checkAuth, (request, response) => {
  const cameras = request.body;

  for(let requiredParameter of ['name', 'full_name']) {
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

  for (let requiredParameter of ['img_src', 'earth_date', 'sol', 'nasa_id']) {
    if (!photos[requiredParameter]) {
      return response.status(422).json({
        error: `You are missing the required parameter ${requiredParameter}`
      });
    }
  }
  database('photos').insert(photos, 'id')
    .then(photos => {
      return response.status(201).json({ id: photos[0]})
    })
    .catch(error => {
      return response.status(500).json({ error })
    })

});

app.patch('/api/v1/cameras/:cameraID', checkAuth, (request, response) => {
  const { cameraID } = request.params;
  const property = Object.keys(request.body);

  database('cameras').where('id', cameraID).update( request.body )
    .then(camera => {
      if (camera) {
        return response.status(201).json({ success: `Updated camera ${cameraID}'s ${property}.`});
      } else {
        return response.status(404).json({ error: `No camera with id ${cameraID} found.`});
      }
    })
    .catch(error => {
      return response.status(500).json({ error });
    })
});

app.patch('/api/v1/photos/:photoID', checkAuth, (request, response) => {
  const { photoID } = request.params;
  const property = Object.keys(request.body);

  database('photos').where('id', photoID).update( request.body )
    .then(photo => {
      if (photo) {
        return response.status(201).json({ success: `Updated photo ${photoID}'s ${property}.`});
      } else {
        return response.status(404).json({error: `No photo with id ${photoID} found.`});
      }
    })
    .catch(error => {
      return response.status(500).json({ error });
    })
});


//delete a photo
app.delete('/api/v1/photos/:id', (request, response) => {
  const { id } = request.params;

  database('photos').where({ id }).del()
    .then((photo) => {
      if(photo) {
        return response.sendStatus(204);
      } else {
        return response.status(422).json({error: `Photo with the id of ${id} was not found`});
      }
    })
    .catch(error => response.status(500).json({ error }));
});

//delete a camera
app.delete('/api/v1/cameras/:id', (request, response) => {
  const { id }= request.params;

  database('cameras').where({ id }).del()
  .then((camera) => {
    if(camera) {
      return response.sendStatus(204);
    } else {
      return response.status(422).json({error: `Camera with the id of ${id} was not found`});
    }
  })
  .catch(error => response.status(500).json({ error }));

});

module.exports = httpServer;
