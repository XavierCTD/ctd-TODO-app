function TodoListItem({ todo, withCompleteTodo}) {
  return (
    <li title={todo}>
      <form>
        <input type="checkbox" 
               checked={todo.isCompleted}
               onChange={() => withCompleteTodo(todo.id)} />
      {todo.title}
      </form>
    </li>
  );
};

export default TodoListItem;