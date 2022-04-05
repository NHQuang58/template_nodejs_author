const { version } = require('../../package.json');
const config = require('../config/config');

const swaggerDef = {
  openapi: '3.0.0',
  info: {
    title: 'EC Tool Backend API',
    version,
    license: {
      name: 'MIT',
      url: 'https://github.com/hagopj13/node-express-boilerplate/blob/master/LICENSE',
    },
  },
  servers: [
    {
      url: `https://ectool.click/v1`,
      // url: `http://localhost:${config.port}/v1`,
    },
  ],
};

if(process.env.NODE_ENV === 'development') {
  swaggerDef.servers[0].url = `http://localhost:${config.port}/v1`;
}

module.exports = swaggerDef;
