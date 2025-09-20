export const initalState = {
    todoList: [],
    isLoading: false,
    isSaving: false,
    errorMessage: "",
}

export const actions = {
    fetchTodos: 'fetchTodos',
    setErrorMessage: 'setErrorMessage',
    addTodo: 'addTodo',
    updateTodo: 'updateTodo',
    completeTodo: 'completeTodo',
}

function todoReducer(state = initalState, action) {
    switch (action.type) {
        case actions.fetchTodos:
            return {
                ...state,
            };
        case actions.setErrorMessage:
            return {
                ...state,
            };
        case actions.addTodo:
            return {
                ...state,
            };
        case actions.updateTodo:
            return {
                ...state,
            };
        case actions.completeTodo:
            return {
                ...state,
            };
        default: 
          return state;
    }
}