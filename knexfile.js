// Update with your config settings.

module.exports = {
  development: {
    client: 'pg',
    connection: 'postgres://localhost/curiosity',
    migrations: {
      directory: './db/migrations'
    },
    useNullAsDefault: true,
    seeds: {
      directory: './db/seeds/dev'
    }
  },

  test: {
    client: 'pg',
    connection: 'postgres://localhost/curiosity_tests',
    useNullAsDefault: true,
    migrations: {
      directory: __dirname + './db/migrations'
    },
    seeds: {
      directory: './db/seeds/test'
    }
  }
};
