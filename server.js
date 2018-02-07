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


app.get('/api/v1/cameras', (request, response) => {
  database('cameras').select()
    .then(projects => {
      return response.status(200).json({ projects });
    })
    .catch(error => {
      return response.status(500).json({ error })
    })
});

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


//get all photos

//get all cameras
