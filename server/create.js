const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const AWSXRay = require('aws-xray-sdk');

const packageDefinition = protoLoader.loadSync(__dirname + '/../proto/service.proto', {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const serviceProto = grpc.loadPackageDefinition(packageDefinition).greeter;

function getServiceFunctions(serviceDef) {
  return Object.keys(serviceDef).reduce((serviceFuncs, funcName) => {
    const func = serviceDef[funcName];
    serviceFuncs[funcName] = (call, callback) => {
      const metadata = call.metadata;
      const traceId = metadata.get('traceId').toString();
      const segmentId = metadata.get('segmentId').toString();
      const segment = new AWSXRay.Segment('server-app', traceId, segmentId);
      const ns = AWSXRay.getNamespace();

      ns.run(() => {
        AWSXRay.setSegment(segment);
        callback(null, func(call.request));
        segment.close();
      });
    };
    return serviceFuncs;
  }, {})
}

async function createGrpcServer(serviceDef) {
  const server = new grpc.Server();
  server.addService(serviceProto.Greeter.service, getServiceFunctions(serviceDef));
  return new Promise((resolve) => {
    server.bindAsync('0.0.0.0:50051', grpc.ServerCredentials.createInsecure(), () => {
      server.start();
      resolve();
    });
  })
}

module.exports = createGrpcServer;
