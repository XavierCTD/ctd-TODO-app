import TodoForm from '../features/TodoForm.jsx';
import TodoList from '../features/TodoList/TodoList.jsx';
import TodosViewForm from '../features/TodosViewForm.jsx';
import styles from "../App.module.css";
import { useEffect } from 'react';
import { useNavigate } from 'react-router';

export default function TodosPage({ todoState, dispatch, addTodo, updateTodo, completeTodo, todoActions, currentTodos, totalPages, currentPage, setSearchParams }) {
  const navigate = useNavigate();

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setSearchParams({ page: currentPage - 1 });
    }
  };

  const handleNextPage = () => {
    if(currentPage < totalPages) {
      setSearchParams({ page: currentPage + 1 });
    }
  };

  useEffect(() => {
   if (totalPages > 0) {
    if (
      Number.isNaN(currentPage) || currentPage < 1 || currentPage > totalPages
    ) {
      navigate("/");
    }
   }
  }, [currentPage, totalPages, navigate]);
  
  return (
    <div className={styles.htmldisplay}>
      <TodoForm onAddTodo={addTodo} />
      {todoState.isLoading ? (
        <p>Todo list loading...</p>
      ) : (
        <TodoList todoList={currentTodos} onCompleteTodo={completeTodo} updateTodo={updateTodo} isLoading={todoState.isLoading}/>
      )}

      <hr />
            <TodosViewForm sortDirection={todoState.sortDirection} setSortDirection={(val) => dispatch({type: todoActions.sortDirection, value: val })} sortField={todoState.sortField} setSortField={(val) => dispatch({type: todoActions.sortField, value: val })} queryString={todoState.queryString} setQueryString={(val) => dispatch({type: todoActions.queryString, value: val })}/>

      {todoState.errorMessage && (
        <div className={styles.newborder}>
            <p>{todoState.errorMessage}</p>
            <button onClick={() => dispatch({ type: todoActions.clearError })}>Dismiss</button>
          </div>
      )}

      <div style={{ marginTop: "1rem" }}>
        <button disabled={currentPage === 1} onClick={handlePreviousPage}>Prev</button>
        <span style={{ margin: "0 1rem" }}>Page {currentPage} of {totalPages}</span>
        <button disabled={currentPage === totalPages} onClick={handleNextPage}>Next</button>
      </div>
    </div>
   )
 }