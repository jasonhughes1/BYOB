# API of Curiosity Rovers Photos Taken on Sol 1500
### [Jason Hughes](https://github.com/jasonhughes1) and [Katie Scruggs](https://github.com/katiescruggs)

## Documentation

To get a JWT that allows access to POST, PATCH, and DELETE requests, please go to '/' and fill out the form with a turing.io email address and an app name.

### GET ENDPOINTS
### To receive a JSON object of camera data
`GET /api/v1/cameras`

Sample response: 
```
{
  "cameras": [
    {
      "id": 5838,
      "name": "NAVCAM",
      "full_name": "Navigation Camera",
      "rover_id": 5,
      "nasa_id": null,
      "created_at": "2018-02-08T22:59:43.683Z",
      "updated_at": "2018-02-08T22:59:43.683Z"
    },
    {
      "id": 5839,
      "name": "MAST",
      "full_name": "Mast Camera",
      "rover_id": 5,
      "nasa_id": null,
      "created_at": "2018-02-08T22:59:43.683Z",
      "updated_at": "2018-02-08T22:59:43.683Z"
    }
  ]
}   
```
### To receive a JSON object of photo data
`GET /api/v1/photos`

Sample response:
```
{
  "photos": [
    {
      "id": 176255,
      "img_src": "http://mars.jpl.nasa.gov/msl-raw-images/msss/01500/mcam/1500ML0076030010603940E01_DXXX.jpg",
      "earth_date": "2016-10-25",
      "sol": 1500,
      "nasa_id": 594011,
      "cameras_id": 5839,
      "created_at": "2018-02-08T22:59:43.737Z",
      "updated_at": "2018-02-08T22:59:43.737Z"
    },
    {
      "id": 176269,
      "img_src": "http://mars.jpl.nasa.gov/msl-raw-images/msss/01500/mcam/1500MR0075980060404383E01_DXXX.jpg",
      "earth_date": "2016-10-25",
      "sol": 1500,
      "nasa_id": 594027,
      "cameras_id": 5839,
      "created_at": "2018-02-08T22:59:43.740Z",
      "updated_at": "2018-02-08T22:59:43.740Z"
    },
  ]
}
```

### To receive a JSON object of photos that one camera has taken
`GET /api/v1/cameras/:cameraID/photos`

Sample response:
```
{
  "photos": [
    {
      "id": 176328,
      "img_src": "http://mars.jpl.nasa.gov/msl-raw-images/proj/msl/redops/ods/surface/sol/01500/soas/rdr/ccam/CR0_530653019PRC_F0582136CCAM02500L1.PNG",
      "earth_date": "2016-10-25",
      "sol": 1500,
      "nasa_id": 593995,
      "cameras_id": 5840,
      "created_at": "2018-02-08T22:59:43.751Z",
      "updated_at": "2018-02-08T22:59:43.751Z"
    },
    {
      "id": 176331,
      "img_src": "http://mars.jpl.nasa.gov/msl-raw-images/proj/msl/redops/ods/surface/sol/01500/soas/rdr/ccam/CR0_530650354PRC_F0582136CCAM01500L1.PNG",
      "earth_date": "2016-10-25",
      "sol": 1500,
      "nasa_id": 594000,
      "cameras_id": 5840,
      "created_at": "2018-02-08T22:59:43.751Z",
      "updated_at": "2018-02-08T22:59:43.751Z"
    },
  ]
}
```

### To receive a JSON object of one photo in particular
`GET /api/v1/photo?{nasa_id}`

Parameters:
| Name | Type | Description |
|------|------|-------------|
| nasa_id | integer | To find a valid nasa_id, GET /api/v1/photos |

Sample response: 
```
{
  "photo": {
    "id": 176260,
    "img_src": "http://mars.jpl.nasa.gov/msl-raw-images/msss/01500/mcam/1500MR0076020040404393E01_DXXX.jpg",
    "earth_date": "2016-10-25",
    "sol": 1500,
    "nasa_id": 594013,
    "cameras_id": 5839,
    "created_at": "2018-02-08T22:59:43.738Z",
    "updated_at": "2018-02-08T22:59:43.738Z"
  }
}
```

### Post Endpoints (JWT Authorization Required):
`POST /api/v1/cameras`

Send your JWT in the header of the request with the key "token".

Send the following parameters in the body:
| Name | Type | Description |
|------|---- |---------------|
| name | string | Name of the new camera |
| full_name | string | Full name of the new camera |

### Patch Endpoints (JWT Authorization Required):

### Delete Endpoints (JWT Authorization Required):
