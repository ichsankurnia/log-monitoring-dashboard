import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import { SocketProvider } from "./context/SocketProvider";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";

const gntRandomNumber = () => {
    return Math.floor((Math.random() * 1000) + 1).toString()
}

function App(props) {
	return (
		<SocketProvider id={gntRandomNumber()}>
			<BrowserRouter basename="/ReactApp/log-apps-monitoring" >
				<Switch>
					<Route path="/auth" render={props => <Login {...props} />} />
					<Route path="/admin" render={props => <Dashboard {...props} />} />
					{/* <Route path="*" render={props => <NotFoundPage {...props} />} /> */}
					<Redirect from="/" to="/admin/index" />
					{/* <Route path="/auth" component={Login} /> */}
					{/* <Route path="/" exact component={Dashboard} /> */}
					{/* <Route path="*" component={NotFoundPage} /> */}
				</Switch>
				{/* <Login /> */}
			</BrowserRouter>
		</SocketProvider>
	);
}

export default App;
