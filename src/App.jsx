
import './App.css';
import TodoForm from './TodoForm';
import Todolist from './TodoList';

function App() {
  return (
    <div>
      <h1>My Todos</h1>
      <Todolist />
      <TodoForm />
    </div>
  )
}

export default App;
