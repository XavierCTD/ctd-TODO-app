import TextInputWithLabel from '../shared/TextInputWithLabel';
import { useRef, useState } from 'react';

function TodoForm({onAddTodo, isSaving}) {

    const [workingTodoTitle, setWorkingTodo] = useState("");
    const todoTitleInput = useRef(null);

    function handleAddTodo(event) {
        event.preventDefault();
        const title = workingTodoTitle.trim();
        if (!title) {
            return;
        };
        onAddTodo({ title, isCompleted: false});
        setWorkingTodo("");
        todoTitleInput.current.focus();
    };

    return(
        <form onSubmit={handleAddTodo}>
            <TextInputWithLabel ref={todoTitleInput} value={workingTodoTitle} onChange={(e) => setWorkingTodo(e.target.value)} elementId={"todoTitle"} labelText="Todo"/>
            <button disabled={workingTodoTitle.trim() === ''}>{isSaving ? 'Saving...' : 'Add Todo'}</button>
        </form>
    );
};

export default TodoForm;