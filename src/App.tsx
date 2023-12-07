import "./App.css";
import { Header } from "./containers/header/header";
import { RegistrationForm } from "./components/registration-form";
import { BettingZone } from "./containers/betting-zone";
import { Statistics } from "./containers/statistics";

export const App = () => {
    return (
        <>
            <Header />
            <BettingZone />

            {/* <Table /> */}
            <Statistics />
            <RegistrationForm />
        </>
    );
};
