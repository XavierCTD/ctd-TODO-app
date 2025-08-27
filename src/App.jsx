
import { useState, useEffect } from 'react';
import './App.css';
import TodoForm from './features/TodoForm.jsx';
import TodoList from './features/TodoList/TodoList.jsx';

function App() {

  const [todoList, setTodoList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  
  const url = `https://api.airtable.com/v0/${import.meta.env.VITE_BASE_ID}/${import.meta.env.VITE_TABLE_NAME}`;
  const token = `Bearer ${import.meta.env.VITE_PAT}`;

  useEffect(() => {
    const fetchTodos = async () => {
      setIsLoading(true);

      const options = {
        method: "GET",
        headers: {
          "Authorization": token
        },
      };
      try {
        const resp = await fetch(url, options);
        if (!resp.ok) {
          throw new Error(resp.statusText);
        }
        const response = await resp.json();

        const fetchedData = response.records.map((record) => {
          return {
            id: record.id,
            title: record.fields.title || "",
            isCompleted: record.fields.isCompleted || false,
          };
        });

        setTodoList(fetchedData);
      } catch (error) {
        setErrorMessage(error.message)
      } finally {
        setIsLoading(false);
      };
      
    };
    
    fetchTodos();
  }, []);

  const addTodo = async (newTodo) => {
    const payload = {
      records: [
        {
          fields: {
            title: newTodo.title,
            isCompleted: newTodo.isCompleted,
          },
        },
      ],
    };

    const options = {
      method: 'POST',
      headers: {
        Authorization: token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    };

    try {
      setIsSaving(true);
      
      const resp = await fetch(url, options);
      if(!resp.ok) {
        throw new Error(resp.statusText);
      }

      const { records } = await resp.json();
      const savedTodo = {
        id: records[0].id,
        ...records[0].fields,
      };

      if (!records[0].fields.isCompleted) {
        {savedTodo.isCompleted = false;}
      };

      setTodoList([...todoList, savedTodo]);
    } catch(error) {
      console.error(error);
      setErrorMessage(error.message);
    } finally  {
      setIsSaving(false);
    }
  };

  const updateTodo = async (editedTodo) => {
    const originalTodo = todoList.find((todo) => todo.id === editedTodo.id);

    const payload = {
      records: [
        {
          id: editedTodo.id,
          fields: {
            title: editedTodo.title,
            isCompleted: editedTodo.isCompleted,
          },
        },
      ],
    };

    const options = {
      method: "PATCH",
      headers: {
        Authorization: token,
        "Contnet-Type": "application/json",
      },
      body: JSON.stringify(payload),
    };

    try {
      setIsSaving(true);
      const resp  = await fetch(url, options);

      if(!resp.ok) {
        throw new Error(resp.statusText);
      };

      const { records } = await resp.json();
      const updatedTodo = {
        id: records[0].id,
        ...records[0].fields,
      };

      if (!updatedTodo.isCompleted) {
        updatedTodo.isCompleted = false;
      }

      setTodoList(
        todoList.map((todo) => 
          todo.id === updatedTodo.id ? updatedTodo : todo
        )
      );
    } catch(error) {
      console.error(error);
      setErrorMessage(`${error.message}. Reverting todo...`);

      const revertedTodos = todoList.map((todo) => 
        todo.id === originalTodo.id ? originalTodo : todo
      );
      setTodoList(revertedTodos);
    } finally {
      setIsSaving(false);
    }
  };
  

  const completeTodo = async (todoInfo) => {
      const originalTodo = todoList.find((todo) => todo.id === todoInfo.id);

      const updatedTodos = todoList.map((todo) => 
        todo.id === todoInfo.id ? todoInfo : todo 
      );
    setTodoList(updatedTodos);

    const payload = {
      records: [
        {
          id: todoInfo.id,
          fields: {
            title: todoInfo.title,
            isCompleted: todoInfo.isCompleted,
          },
        },
      ],
    };

    const options = {
      method: "PATCH",
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    };

    try {
      const resp = await fetch(url, options);
      if (!resp.ok) {
        throw new Error("ERROR: Todo Failed");
      };
    } catch (error) {
      console.error(error);
      setErrorMessage(`${error.message} Reverting todo...`);

      const revertedTodos = todoList.map((todo) => 
        todo.id === originalTodo.id ? originalTodo : todo
      );
      setTodoList(revertedTodos);
    }
  };
  
  return (
    <div>
      <h1>My Todos</h1>
      <TodoForm onAddTodo={addTodo}/>
      {isLoading ? (
        <p>Todo list loading...</p>
      ) : (
        <TodoList todoList={todoList} onCompleteTodo={completeTodo} updateTodo={updateTodo} isLoading={isLoading}/>
      )};

      {errorMessage && (
        <div>
          <hr />
          <p>{errorMessage}</p>
          <button onClick={() => setErrorMessage("")}>Dismiss</button>
        </div>
      )}
    </div>    
  );
};

export default App;