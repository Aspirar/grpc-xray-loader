const { greeter } = require('./clients');

async function run() {
  const user = process.argv.length >= 3 ? process.argv[2] : 'World';
  const greeting = await greeter.sayHello({ name: user })
  console.log('Greeting:', greeting.message);
}

run();
