var Fluxish = require('./lib/fluxish');

var app = new Fluxish();
app.loadStores({
  todo: require('./stores/todoStore')
});

app.loadActions(require('./actions/todoActions'));

app.listen('todo', function(ctx) {
  console.log('------some change occured!');
  console.log('latest:');
  var state = ctx.stores.todo.getAllTodos();
  state.forEach(function(todo) {
    console.log(todo)
  });
  console.log('======end');
});

var context = app.getContext();

console.log('get empty');
var curState = context.stores.todo.getAllTodos();
console.log('Should be 0: ', curState.length);
console.log();

console.log('add first');
context.actions.AddTodo('this is a test');
curState = context.stores.todo.getAllTodos();
console.log('Should be 1: ', curState.length);
console.log();

console.log('add second');
context.actions.AddTodo('test a second one');
curState = context.stores.todo.getAllTodos();
console.log('Should be 2: ', curState.length);
console.log();

console.log('add third');
context.actions.AddTodo('third test for uhm');
curState = context.stores.todo.getAllTodos();
console.log('Should be 3: ', curState.length);
console.log();

console.log('change third');
context.actions.ChangeTodo(2, 'third test because reasons');
curState = context.stores.todo.getAllTodos();
console.log('Should still be 3: ', curState.length);
console.log();

console.log('remove second');
context.actions.RemoveTodo(1);
curState = context.stores.todo.getAllTodos();
console.log('Should be 2: ', curState.length);
console.log();

console.log('change new second to same (no emit should occur)');
context.actions.ChangeTodo(1, 'third test because reasons');
curState = context.stores.todo.getAllTodos();
console.log('Should still be 2: ', curState.length);
console.log();

curState.forEach(function(todo) {
  console.log(todo)
});
