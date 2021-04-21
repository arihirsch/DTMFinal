import React from "react"
import { Route, Switch } from "react-router-dom"
import ProtectedOptionPage from "./ProtectedOptionPage"
import PriceOptionsPage from "./PriceOptionsPage"
import BondYTMPage from "./BondYTMPage"

import HomePage from "./HomePage"

function App() {
    return (
        <main>
            <Switch>
                <Route path="/" component={HomePage} exact />
                <Route path="/protected_option" component={ProtectedOptionPage} />
                <Route path="/price_options" component={PriceOptionsPage} />
                <Route path="/bond_ytm" component={BondYTMPage} />
                <Route component={Error} />
            </Switch>
        </main>
    )
}
export default App