
import { useState } from 'react';
import './App.css';
import TodoForm from './TodoForm';
import TodoList from './TodoList';

function App() {
  const [todoList, setTodoList] = useState([]);
  function addTodo(title) {
    const newTodo = {title: title, id:Date.now(), isCompleted: false}
    setTodoList([...todoList, newTodo]);
  }

  function completeTodo(todoId) {
      const updatedTodos = todoList.map((todo) => {
        if (todo.id === todoId) {
          return { ...todo, isCompleted: true}
        }
          return todo;
      });
    setTodoList(updatedTodos);
    }

  return (
    <div>
      <h1>My Todos</h1>
      <TodoForm onAddTodo={addTodo}/>
      <TodoList todoList={todoList} onCompleteTodo={completeTodo}/>
    </div>    
  );
};

export default App;