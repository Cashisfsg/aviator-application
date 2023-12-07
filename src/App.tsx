import "./App.css";
import { Header } from "./containers/header";
import { Bet } from "./components/bet";
import { Table } from "./components/table";
import { RegistrationForm } from "./components/registration-form";

export const App = () => {
    return (
        <>
            <Header />
            <Bet />
            <Bet />
            <Table />
            <RegistrationForm />
        </>
    );
};
