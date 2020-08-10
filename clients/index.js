const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const fs = require('fs');
const _ = require('lodash');
const util = require('util');

const files = fs.readdirSync(__dirname);
const clients = files.filter(file => file.endsWith('.proto')).reduce((acc, file) => {
  const package = file.split('.')[0];
  const packageDefinition = protoLoader.loadSync(__dirname + '/' + file, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
  });
  const serviceProto = grpc.loadPackageDefinition(packageDefinition)[package];
  const client = new serviceProto[_.startCase(package)]('localhost:50051', grpc.credentials.createInsecure());
  for (const funcName of Object.keys(Object.getPrototypeOf(client))) {
    const func = client[funcName];
    client[funcName] = util.promisify(func);
  }
  
  acc[package] = client;
  return acc;
}, {});

module.exports = clients;
