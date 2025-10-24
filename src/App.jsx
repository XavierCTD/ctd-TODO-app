import { useReducer, useEffect, useCallback, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useSearchParams} from 'react-router';
import './App.css';
import TodosPage from './pages/TodosPage.jsx';
import Header from "./shared/Header.jsx";
import {
  todoReducer as todosReducer,
  actions as todoActions,
  initialState as initialTodosState,
} from './reducers/todos.reducers.js';
import About from './pages/About.jsx';
import NotFound from './pages/NotFound.jsx';

const url = `https://api.airtable.com/v0/${import.meta.env.VITE_BASE_ID}/${import.meta.env.VITE_TABLE_NAME}`;
const token = `Bearer ${import.meta.env.VITE_PAT}`;

function AppContent() {

  {/* State Varibles and Hooks */}
  const [todoState, dispatch] = useReducer(todosReducer, initialTodosState);
  const [title, setTitle] = useState("Todo List");
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  {/* Pagination */}
  const itemsPerPage = 15;
  const currentPage = parseInt(searchParams.get('page') || '1', 10);

  {/* URL and Token Reference */}
    const encodeUrl = useCallback(() => {
      const sortQuery = `sort[0][field]=${todoState.sortField}&sort[0][direction]=${todoState.sortDirection}`;
      const filterQuery = todoState.queryString ? `&filterByFormula=SEARCH("${todoState.queryString}", {title})` : "";
      
      return encodeURI(`${url}?${sortQuery}${filterQuery}`);
        }, [todoActions.queryString, todoActions.sortDirection, todoActions.sortField]);

    const normalizeTodo = (record) => ({
      id: record.id,
      title: record.fields.title || "",
      isCompleted: record.fields.isCompleted || false,
    });    

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
        const todos = response.records.map(normalizeTodo);

          dispatch({ type: todoActions.loadTodos, records: todos });
      } catch (error) {
          dispatch({ type: todoActions.setLoadError, error});
      } 
    }, [encodeUrl]);
    
    useEffect(() => {
      fetchTodos();
    }, [fetchTodos]);

  {/* Helper Functions */}
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
      const normaltodo = normalizeTodo(response.records[0]);

      dispatch({ type: todoActions.addTodo, savedTodo: normaltodo });
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

      const response = await resp.json();
      const normaltodo = normalizeTodo(response.records[0]);

      dispatch({
        type: todoActions.updateTodo,
        editedTodo: normaltodo,
      });
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
      const resp = await fetch(url, options);
      if (!resp.ok) {
        const errorData = await resp.json();
        throw new Error(errorData.error.message || resp.statusText);
      }
      
      const response = await resp.json();
      const normaltodo = normalizeTodo(response.records[0]);

      dispatch({
        type: todoActions.completeTodo,
        editedTodo: normaltodo,
      });
    } catch (error) {
      dispatch({
        type: todoActions.revertTodo,
        editedTodo: todoInfo,
        error,
      });
    }
  };

  {/* Link Reference */}
  useEffect(() => {
    if (location.pathname === "/") setTitle("Todo List");
    else if (location.pathname === "/about") setTitle("About");
    else setTitle("Not Found");
  }, [location]);
  
  {/* JSX Returned */}
  return (
    <>
    <Header title={title} />
    <Routes> 
      <Route
         path="/"
         element={
           <TodosPage todoState={todoState} todoActions={todoActions} updateTodo={updateTodo} addTodo={addTodo} completeTodo={completeTodo} dispatch={dispatch} currentPage={currentPage} setSearchParams={setSearchParams} itemsPerPage={itemsPerPage} />
         }
    />
      <Route path="/about" element={<About />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
    </>
  );
};

export default function App() {
  return (
    <Router>
      <AppContent />      
    </Router>
  )
};