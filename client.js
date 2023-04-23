const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");

const packageDef = protoLoader.loadSync("todo.proto", {});
const grpcObject = grpc.loadPackageDefinition(packageDef);

const todoPackage = grpcObject.todoPackage;

const client = new todoPackage.Todo("localhost:40000", grpc.credentials.createInsecure());

let text = process.argv[2];

client.create({
    "id": -1,
    "text": text
}, (err, response) => {
    if(err) throw err;

    console.log(JSON.stringify(response));
});

// client.all({}, (err, response) => {
//     if(err) throw err;

//     console.log(JSON.stringify(response));
// })

const call = client.allStream({});

call.on("data", (message) => {
    console.log("Received: " + JSON.stringify(message))
});

call.on("end", (m) => console.log("server finished"));
