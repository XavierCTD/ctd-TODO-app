import TextInputWithLabel from '../shared/TextInputWithLabel';
import { useRef } from 'react';
import { useState } from 'react';

function TodoForm({onAddTodo}) {
    const [workingTodoTitle, setWorkingTodo] = useState("");
    const todoTitleInput = useRef("");
    function handleAddTodo(event) {
        event.preventDefault();
        onAddTodo(workingTodoTitle);
        setWorkingTodo("")
        todoTitleInput.current.focus()
    }

    return(
        <form onSubmit={handleAddTodo}>
            <TextInputWithLabel ref={todoTitleInput} value={workingTodoTitle} onChange={(e) => setWorkingTodo(e.target.value)} elementId={"todoTitle"} labelText="Todo"/>
            <button type="submit">Add Todo</button>
        </form>
    );
}

export default TodoForm;