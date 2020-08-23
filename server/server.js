'use strict';

const { schema, resolver } = require('./source/interface.js');

const { graphqlHTTP } = require('express-graphql');

const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

let server = express();

server.use(morgan('combined'));
server.use(cors());

// graphiql should not be
// enabled in production
server.use('/graphql',
  graphqlHTTP({
    schema: schema,
    rootValue: resolver,
    graphiql: true
  })
);

const normalizePort = function(value) {
  let port = parseInt(value, 10);
  if (isNaN(port)) {
    // named pipe
    return value;
  }
  if (port >= 0) {
    // port number
    return port;
  }
  return false;
};

let port = normalizePort(process.env.PORT || '4000');

server.listen(port, () => {
  console.log("Express Server with a GraphQL API is running at http://localhost:" + port + "/graphql");
});