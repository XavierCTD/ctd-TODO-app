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
                todoList: action.records,
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
            return {
                ...state,
                todoList: [...state.todoList, action.savedTodo],
                isSaving: false,
            };
        
        case actions.endRequest:
            return {
                ...state,
                isLoading: false,
                isSaving: false,  
            };

        case actions.updateTodo: {
            const updatedTodos = state.todoList.map((todo) =>
            todo.id === action.editedTodo.id ? { ...todo, ...action.editedTodo } : todo
        );
        
            return {
                ...state,
                todoList: updatedTodos,
                errorMessage: action.error ? action.error.message : state.errorMessage,
            };
        };

        case actions.completeTodo:
            if(action.editedTodo) {
                return {
                    ...state,
                    todoList: state.todoList.map((todo) => todo.id === action.editedTodo.id ? action.editedTodo : todo),
                };
            }
            return {
                ...state,
                todoList: state.todoList.map((todo) =>
                todo.id === action.id
                  ? { ...todo, isCompleted: action.isCompleted }
                  : todo
                ),
            };
        
        case actions.revertTodo: {
            const revertedTodos = state.todoList.map((todo) =>
            todo.id === action.editedTodo.id ? action.editedTodo : todo 
        );
            
            return {
                ...state,
                todoList: revertedTodos,
                errorMessage: action.error ? action.error.message : state.errorMessage,
            }
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