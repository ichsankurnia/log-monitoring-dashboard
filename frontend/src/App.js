import { BrowserRouter, Route, Switch } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import NotFoundPage from "./pages/NotFoundPage";

function App(props) {
	return (
		<BrowserRouter>
			<Switch>
				{/* <Route path="/auth" render={props => <Login {...props} />} />
				<Route path="/" exact render={props => <Dashboard {...props} />} />
				<Route path="*" render={props => <NotFoundPage {...props} />} /> */}
				<Route path="/auth" component={Login} />
				<Route path="/" exact component={Dashboard} />
				<Route path="*" component={NotFoundPage} />
			</Switch>
			{/* <Login /> */}
		</BrowserRouter>
	);
}

export default App;
