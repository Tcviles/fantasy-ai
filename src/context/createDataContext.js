import { useReducer, createContext } from 'react';

let latestState = null; // ⬅️ outside scope to store the live state

export const getAppState = () => latestState; // ⬅️ exported getter

export default (reducer, actions, initialState) => {
    const Context = createContext();

    const Provider = ({ children }) => {
        const [state, dispatch] = useReducer((...args) => {
            const newState = reducer(...args);
            latestState = newState;         // ⬅️ keep the reference up to date
            return newState;
        }, initialState);

        latestState = state; // ⬅️ for initial mount

        const boundActions = {};
        const getState = () => latestState; // ⬅️ will now always reflect latest

        for (let key in actions) {
            boundActions[key] = actions[key](dispatch, getState);
        }

        return (
            <Context.Provider value={{ state, dispatch, ...boundActions }}>
                {children}
            </Context.Provider>
        );
    };

    return { Context, Provider };
};
