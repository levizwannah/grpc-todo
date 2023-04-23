const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");

const packageDef = protoLoader.loadSync("todo.proto", {});
const grpcObject = grpc.loadPackageDefinition(packageDef);

const todoPackage = grpcObject.todoPackage;

const server = new grpc.Server();
server.bindAsync("0.0.0.0:40000", grpc.ServerCredentials.createInsecure(), (error, port) => {
    if(error) throw error;

    server.start();
});

server.addService(todoPackage.Todo.service, {
    "create": createTodo,
    "all": readTodos,
    "allStream": readTodosAsync
});

const todos = [];

function createTodo(call, callback){
    let item = {
        id: todos.length + 1,
        text: call.request.text
    }
    
    todos.push(item);

    callback(null, item);
}

function readTodos(call, callback){
    callback(null, {items: todos});
}

function readTodosAsync(call, callback){
    todos.forEach(todo => call.write(todo));
    call.end();
}