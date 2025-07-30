import TodoListItem from './TodoListItem';


function TodoList({todoList}) {

    return (
        <ul>
            {todoList.map((todo) =>
                  <TodoListItem
                     key={todo.id} title={todo}
                  />)}
        </ul>
    );
};

export default TodoList;