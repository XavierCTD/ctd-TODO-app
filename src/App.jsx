import { useState } from 'react';
import './App.css';
import TodoForm from './TodoForm';
import TodoList from './TodoList';

function App() {
  const [newTodo, setNewTodo] = useState('Todo Added.');

  return (
    <div>
      <h1>My Todos</h1>
      <TodoList />
      <p>{newTodo}</p>
      <TodoForm />
    </div>    
  );
};

export default App;
