import "./App.css";
import { ReactRouterProvider } from "./router/provider";
import { store } from "./store";
import { Provider } from "react-redux";

export const App = () => {
    return (
        <Provider store={store}>
            <ReactRouterProvider />
        </Provider>
    );
};
