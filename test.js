const AWSXRay = require('aws-xray-sdk');

const traceId = '1-5f338728-a947f614094960a86a7a98b9';
const segmentId = '46859f1a5ed7d69e';
const segment = new AWSXRay.Segment('app', traceId, segmentId);
console.log(segment);
const ns = AWSXRay.getNamespace();

async function run() {
	ns.run(() => {
		AWSXRay.setSegment(segment);
		const s = AWSXRay.getSegment();
		console.log(s);
	});
}

run();
