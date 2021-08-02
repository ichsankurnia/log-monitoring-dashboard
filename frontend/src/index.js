import React from 'react';
import ReactDOM from 'react-dom';
import 'antd/dist/antd.css';
// import './index.css'
import App from './App';
import { Provider } from 'react-redux';
import configureStore from './redux/store/configureStore';

const store = configureStore()

ReactDOM.render(
	<Provider store={store}>
		<App />
	</Provider>,
  document.getElementById('root')
);