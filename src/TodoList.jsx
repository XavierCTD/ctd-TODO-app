
import TodoListItem from './TodoListItem';

function TodoList() {
    const todos = [
    {id: 1, title: "Passing tests from CTD"},
    {id: 2, title: "Looking for resources on coding"},
    {id: 3, title: "Make enough credit for an apartment"},
  ];

  return (
    <ul>
      {todos.map((todo) => {
        return (
        <TodoListItem 
           key={todo.id} title={todo.title}
        />
      );
    })}
    </ul>
  );
};

export default TodoList;