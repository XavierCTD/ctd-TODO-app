
import TodoListItem from './TodoListItem';

function TodoList({onCompleteTodo, todoList}) {

  const filteredTodoList = todoList.filter(todo => todo.isCompleted === false)

  return (
    <>
    {filteredTodoList.length === 0 ? <p>"Add todo above to get started."</p> : 
    <ul>
      {filteredTodoList.map((todo) => {
        return (
        <TodoListItem 
           key={todo.id} todo={todo} withCompleteTodo={onCompleteTodo}
        />
      );
    })}
    </ul>}
    </>
  );
};

export default TodoList;