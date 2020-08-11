const { greeter } = require('./clients');
const AWSXRay = require('aws-xray-sdk');

AWSXRay.capturePromise();

async function run() {
  const segment = new AWSXRay.Segment('app');
  const ns = AWSXRay.getNamespace();

  ns.run(async () => {
    AWSXRay.setSegment(segment);
    const user = process.argv.length >= 3 ? process.argv[2] : 'World';
    const greeting = await greeter.sayHello({ name: user });
    console.log('Greeting:', greeting.message);
    segment.close();
  });
}

run();
