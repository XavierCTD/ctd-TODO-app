export const initialState = {
    todoList: [],
    isLoading: false,
    isSaving: false,
    errorMessage: "",
    queryString: "",
    sortDirection: "desc",
    sortField: "createdTime",
}

export const actions = {
    fetchTodos: 'fetchTodos',
    loadTodos: 'loadTodos',
    setLoadError: 'setLoadError',
    startRequest: 'startRequest',
    addTodo: 'addTodo',
    endRequest: 'endRequest',
    updateTodo: 'updateTodo',
    completeTodo: 'completeTodo',
    revertTodo: 'revertTodo',
    clearError: 'clearError',
    queryString: 'queryString',
    sortDirection: 'sortDirection',
    sortField: 'sortField',
}

export function todoReducer(state = initialState, action) {
    switch (action.type) {
        case actions.fetchTodos:
            return {
                ...state, isLoading: true,
            };

        case actions.loadTodos:
            return {
                ...state,
                todoList: action.records.map((record) => ({
                    id: record.id,
                    title: record.fields.title || "",
                    isCompleted: record.fields.isCompleted || false,
                })),
                isLoading: false,
            };

        case actions.setLoadError:
            return {
                ...state,
                errorMessage: action.error.message,
                isLoading: false,
            };

        case actions.startRequest:
            return {
                ...state,
                isSaving: true,
            };

        case actions.addTodo:
            const savedTodo = {
                id: action.savedTodo.id,
                title: action.savedTodo.fields.title || "",
                isCompleted: action.savedTodo.fields.isCompleted || false,  
            };
            return {
                ...state,
                todoList: [...state.todoList, savedTodo],
                isSaving: false,
            };
        
        case actions.endRequest:
            return {
                ...state,
                isLoading: false,
                isSaving: false,  
            };

        case actions.updateTodo: {
            const updateTodos = state.todoList.map((todo) =>
            todo.id === action.editedTodo.id ? action.editedTodo : todo
        );
            const updatedState = {
                ...state, 
                todoList: updateTodos,
            };

            if(action.error) {
                updatedState.errorMessage = action.error.message;
            }

            return updatedState;
        };

        case actions.completeTodo:
            return {
                ...state,
                todoList: state.todoList.map((todo) =>
                todo.id === action.id
                  ? { ...todo, isCompleted: action.isCompleted }
                  : todo
                ),
            };
        
        case actions.revertTodo: {
            const revertTodos = state.todoList.map((todo) =>
            todo.id === action.editedTodo.id ? action.editedTodo : todo 
        );
            const revertedState = {
                ...state,
                todoList: revertTodos,
            };

            if(action.error) {
                revertedState.errorMessage = action.error.message;
            }

            return revertedState;
        };
        
        case actions.clearError: 
            return {
                ...state,
                errorMessage: "",
            };

        case actions.queryString:
            return {
                ...state,
                queryString: action.value
            };

        case actions.sortDirection:
            return {
                ...state,
                sortDirection: action.value,
            };

        case actions.sortField:
            return {
                ...state,
                sortField: action.value
            }; 

        default: 
          return state;
    }
}