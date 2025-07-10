
import './App.css'

function App() {
  const todos = [
    {id: 1, title: "Passing tests from CTD"},
    {id: 2, title: "Looking for resources on coding"},
    {id: 3, title: "Make enough credit for an apartment"},
  ]

  return (
    <div>
      <h1>My Todos</h1>
      <ul>
        {todos.map(todo => <li key={todo.id}>{todo.title}</li>)}
      </ul>
    </div>    
  )
}

export default App
