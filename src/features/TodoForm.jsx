import styled from 'styled-components';
import TextInputWithLabel from '../shared/TextInputWithLabel';
import { useRef, useState } from 'react';

const StyledButton = styled.button`
      font-family: italic;
      font-size: large;
    `;

const StyledForm = styled.form`
  padding: 20px;
`;

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
        <StyledForm onSubmit={handleAddTodo}>
            <TextInputWithLabel ref={todoTitleInput} value={workingTodoTitle} onChange={(e) => setWorkingTodo(e.target.value)} elementId={"todoTitle"} label="Todo:"/>
            <StyledButton disabled={workingTodoTitle.trim() === ''}>{isSaving ? 'Saving...' : 'Add Todo'}</StyledButton>
        </StyledForm>
    );
};

export default TodoForm;