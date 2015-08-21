var AddTodo = function(context, text) {
  var todoStore = context.stores.todo;

  todoStore.addTodo(text);
};

var ChangeTodo = function(context, index, text) {
  var todoStore = context.stores.todo;

  todoStore.changeTodo(index, text);
};

var RemoveTodo = function(context, index) {
  var todoStore = context.stores.todo;

  todoStore.removeTodo(index);
};

module.exports = {AddTodo: AddTodo, ChangeTodo: ChangeTodo, RemoveTodo: RemoveTodo};
