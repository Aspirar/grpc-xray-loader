const AWSXRay = require('aws-xray-sdk');

const segment = new AWSXRay.Segment('app');
const ns = AWSXRay.getNamespace();

async function run() {
	ns.run(() => {
		AWSXRay.setSegment(segment);
		const s = AWSXRay.getSegment();
		console.log(s);
	});
}

run();
