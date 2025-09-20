import { useReducer, useEffect, useCallback } from 'react';
import './App.css';
import styles from './App.module.css';
import TodoForm from './features/TodoForm.jsx';
import TodoList from './features/TodoList/TodoList.jsx';
import TodosViewForm from './features/TodosViewForm.jsx';
import {
  todoReducer as todosReducer,
  actions as todoActions,
  initialState as initialTodosState,
} from './reducers/todos.reducers.js';

const url = `https://api.airtable.com/v0/${import.meta.env.VITE_BASE_ID}/${import.meta.env.VITE_TABLE_NAME}`;
const token = `Bearer ${import.meta.env.VITE_PAT}`;

function App() {

  const [todoState, dispatch] = useReducer(todosReducer, initialTodosState);
  
    const encodeUrl = useCallback(() => {
      const sortQuery = `sort[0][field]=${todoState.sortField}&sort[0][direction]=${todoState.sortDirection}`;
      const filterQuery = todoState.queryString ? `&filterByFormula=SEARCH("${todoState.queryString}", {title})` : "";
      
      return encodeURI(`${url}?${sortQuery}${filterQuery}`);
        }, [todoActions.queryString, todoActions.sortDirection, todoActions.sortField]);

    const fetchTodos = useCallback(async () => {
      dispatch({ type: todoActions.fetchTodos });

      try {
        const resp = await fetch(encodeUrl(), {
          method: "GET",
          headers: { Authorization: token },
        });

        if (!resp.ok) {
          const errorData = await resp.json();
          throw new Error(errorData.error?.message || resp.statusText);
        }
        
        const response = await resp.json();
          dispatch({ type: todoActions.loadTodos, records: response.records });
      } catch (error) {
          dispatch({ type: todoActions.setLoadError, error});
      } 
    }, [encodeUrl]);
    
    useEffect(() => {
      fetchTodos();
    }, [fetchTodos]);

    

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
    
    dispatch({ type: todoActions.startRequest });
    try {
      const resp = await fetch(url, options);
      if(!resp.ok) {
        const errorData = await resp.json();
        throw new Error(errorData.error?.message || resp.statusText);
      }

      const response = await resp.json();
      const savedTodo = response.records[0];
      dispatch({ type: todoActions.addTodo, savedTodo });
    } catch(error) {
        dispatch({ type: todoActions.setLoadError, error});        
    } finally  {
      dispatch({ type: todoActions.endRequest });
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
      dispatch({
        type: todoActions.updateTodo,
        editedTodo,
      });

      const resp = await fetch(url, options);
      if (!resp.ok) {
        const errorData = await resp.json();
        throw new Error(errorData.error.message || resp.statusText);
      }
    } catch(error) {
      dispatch({
        type: todoActions.revertTodo,
        editedTodo,
        error,
      });
    } finally {
      dispatch({ type: todoActions.endRequest });
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
      dispatch({
        type: todoActions.completeTodo,
        id: todoInfo.id,
        isCompleted: todoInfo.isCompleted,
      });

      const resp = await fetch(url, options);
      if (!resp.ok) {
        const errorData = await resp.json();
        throw new Error(errorData.error.message || resp.statusText);
      }
    } catch (error) {
      dispatch({
        type: todoActions.revertTodo,
        editedTodo: todoInfo,
        error,
      });
    }
  };
  
  return (
    <div className={styles.htmldisplay}>
      <h1>My Todos</h1>
      <TodoForm onAddTodo={addTodo}/>

      {todoState.isLoading ? (
        <p>Todo list loading...</p>
      ) : (
        <TodoList todoList={todoState.todoList} onCompleteTodo={completeTodo} updateTodo={updateTodo} isLoading={todoState.isLoading}/>
      )}

      <hr />
            <TodosViewForm sortDirection={todoState.sortDirection} setSortDirection={(val) => dispatch({type: todoActions.sortDirection, value: val })} sortField={todoState.sortField} setSortField={(val) => dispatch({type: todoActions.sortField, value: val })} queryString={todoState.queryString} setQueryString={(val) => dispatch({type: todoActions.queryString, value: val })}/>

      {todoState.errorMessage && (
        <div className={styles.newborder}>
            <p>{todoState.errorMessage}</p>
            <button onClick={() => dispatch({ type: todoActions.clearError })}>Dismiss</button>
          </div>
      )}
    </div>    
  );
};

export default App;