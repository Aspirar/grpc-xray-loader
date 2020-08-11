const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const fs = require('fs');
const _ = require('lodash');
const util = require('util');
const AWSXRay = require('aws-xray-sdk');

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
    const promisifiedFunc = util.promisify(func);
    client[funcName] = (args) => {
      const metadata = new grpc.Metadata();
      const segment = AWSXRay.getSegment();
      metadata.add('traceId', segment.trace_id);
      metadata.add('segmentId', segment.id);
      return promisifiedFunc.call(client, args);
    }
  }
  
  acc[package] = client;
  return acc;
}, {});

module.exports = clients;
