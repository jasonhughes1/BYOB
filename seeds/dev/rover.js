
exports.seed = function(knex, Promise) {

  return knex('photos').del()
    .then(() => knex('cameras').del())
    .then(function() {

      return Promise.all([

        knex('cameras').insert({
          name: 'curiosity'
        }, 'id')
        .then(photos => {
          return knex('photos').insert([
            {
              img_src: "http://mars.jpl.nasa.gov/msl-raw-images/proj/msl/redops/ods/surface/sol/01954/opgs/edr/ncam/NRB_570959149EDR_F0680214NCAM00207M_.JPG",
              earth_date: "2018-02-03",
              sol: 1954,
              nasa_id: 650529,
              cameras_id: photos[0]
            }
          ])
        })
        .then(() => console.log('Seeding complete'))
        .catch(error => console.log(`Error seeding data: ${error}`))
      ])
    });
};
