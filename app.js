const createGrpcServer = require('./server/create');

const serviceDef = {
  sayHello({ name }) {
    return { message: `Hello ${name}` };
  },
};

createGrpcServer(serviceDef)
  .then(() => {
    console.log('Server started');
  })
