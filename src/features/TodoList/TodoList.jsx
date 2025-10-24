import TodoListItem from './TodoListItem';
import styles from './TodoList.module.css';

function TodoList({onCompleteTodo, todoList, updateTodo}) {

  return (
    <>
    {todoList.length === 0 ? ( <p>"Add todo above to get started."</p> ) : ( 
    <ul className={styles.nopadding}>
      {todoList.map((todo) => (
        <TodoListItem 
           key={todo.id} todo={todo} withCompleteTodo={onCompleteTodo} onUpdateTodo={updateTodo}
        />
    ))}
    </ul>
    )}
    </>
  );
};

export default TodoList;