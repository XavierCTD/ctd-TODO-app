
import { useState, useEffect } from 'react';
import './App.css';
import TodoForm from './features/TodoForm.jsx';
import TodoList from './features/TodoList/TodoList.jsx';
import TodosViewForm from './features/TodosViewForm.jsx';

const url = `https://api.airtable.com/v0/${import.meta.env.VITE_BASE_ID}/${import.meta.env.VITE_TABLE_NAME}`;
const token = `Bearer ${import.meta.env.VITE_PAT}`;

const encodeUrl = ({ sortField, sortDirection, queryString}) => {
  
  const validFields = ["title", "createdTime"];
  const safeSortField = validFields.includes(sortField) ? sortField : "title";

  let sortQuery = `sort[0][field]=${sortField}&sort[0][direction]=${sortDirection}`;
  let searchQuery = "";

  if (queryString) {
    searchQuery = `&filterByFormula=SEARCH("${encodeURIComponent(queryString)}", {title})`;
  }
  return `${url}?${sortQuery}${searchQuery}`;
};

function App() {

  const [todoList, setTodoList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [sortField, setSortField] = useState("createdTime");
  const [sortDirection, setSortDirection] = useState("desc");
  const [queryString, setQueryString] = useState("");

  const fetchTodos = async () => {
      setIsLoading(true);

      const options = {
        method: "GET",
        headers: {
          "Authorization": token
        },
      };

      try {
        const resp = await fetch(encodeUrl({ sortField, sortDirection, queryString}), options);

        if (!resp.ok) {
          const errorData = await resp.json();
          console.error("Airtable error full payload:", JSON.stringify(errorData, null, 2));
          throw new Error(errorData?.error?.message || resp.statusText);
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
        console.log("Caught error object", error);
        if (error.response) {
          const errJson = await error.response.json();
          console.error("Error response JSON:", errJson);
        }
        setErrorMessage(error.message || "Something went wrong");
      } finally {
        setIsLoading(false);
      };
      
    };

  useEffect(() => {
    fetchTodos();
  }, [sortDirection, sortField, queryString]);

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
        const errorData = await resp.json();
        throw new Error(errorData.error?.message || resp.statusText);
      }

      await fetchTodos();
    } catch(error) {
      console.error();
      setErrorMessage(error.message);
    } finally  {
      setIsSaving(false);
    }
  };

  const updateTodo = async (editedTodo) => {
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
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    };

    try {
      setIsSaving(true);
      const resp  = await fetch(url, options);
      if(!resp.ok) {
        const errorData = await resp.json();
        throw new Error(errorData.error?.message || resp.statusText);
      }

      await fetchTodos();
    } catch(error) {
      console.error();
      setErrorMessage(error.message);
    } finally {
      setIsSaving(false);
    }
  };
  

  const completeTodo = async (todoInfo) => {
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
        const errorData = await resp.json();
        throw new Error(errorData.error?.message || resp.statusText);
      }

      await fetchTodos();
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

      <hr />
            <TodosViewForm sortDirection={sortDirection} setSortDirection={setSortDirection} sortField={sortField} setSortField={setSortField} queryString={queryString} setQueryString={setQueryString}/>

      {errorMessage && (
        <div>
            <p>{errorMessage}</p>
            <button onClick={() => setErrorMessage("")}>Dismiss</button>
          </div>
      )}
    </div>    
  );
};

export default App;