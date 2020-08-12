const AWSXRay = require('aws-xray-sdk');

const segment = new AWSXRay.Segment('app', '1-5f338728-a947f614094960a86a7a98b9', '46859f1a5ed7d69e');
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
