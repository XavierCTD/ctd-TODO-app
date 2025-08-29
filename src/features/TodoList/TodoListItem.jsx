import TextInputWithLabel from "../../shared/TextInputWithLabel";
import { useState, useEffect } from "react";

function TodoListItem({ todo, withCompleteTodo, onUpdateTodo}) {

const [workingTitle, setWorkingTitle] = useState(todo.title);
const [isEditing, setIsEditing] = useState(false);

useEffect(() => {
  setWorkingTitle(todo.title || "")
}, [todo]);

const handleCancel = () => {
  setWorkingTitle(todo.title || "");
  setIsEditing(false);
}

const handleEdit = (event) => {
  setWorkingTitle(event.target.value);
}

  function handleUpdate(event) {
  if (!isEditing) {
    return;
  }
  event.preventDefault();
  onUpdateTodo({...todo, title: workingTitle});
  setIsEditing(false);
}
  return (
    <li>
      <form onSubmit={handleUpdate}>
        {isEditing ? (
          <>
          <TextInputWithLabel elemnetId={`edit-${todo.id}`} label="Edit Todo" value={workingTitle} onChange={handleEdit}/>
          <button type="button" onClick={handleCancel}>Cancel</button>
          <button type="button" onClick={handleUpdate}>Update</button>
          </>
        ) : (
          <>
            <label>
              <input
                  type="checkbox"
                  id={`checkbox${todo.id}`}
                  checked={todo.isCompleted || false}
                  onChange={() => withCompleteTodo({
                    ...todo,
                    isCompleted: !todo.isCompleted,
                  })
                }
              />
            </label>
            <span onClick={() => setIsEditing(true)}>{todo.title}</span>
          </>
        )}
      </form>
    </li>
  );
};

export default TodoListItem;