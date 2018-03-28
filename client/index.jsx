// Main index.js file, this is where you render the React Virtual DOM
// i.e.
// ReactDOM.render(<App/>, document.getElementById('app'));
// where <App/> is the root component of the application

import 'babel-polyfill';  // To simulate a full ES2015 environment and full support for browsers
import React from 'react';  // Main React library
import ReactDOM from 'react-dom';  // Used to render virtual DOM
import App from './components/App.jsx';  // Main App (root) component
import { BrowserRouter } from 'react-router-dom';  // React Router v4
import { Provider } from 'react-redux';

import ReactKernel from '../app/ReactKernel';

const kernel = new ReactKernel('production');
kernel.boot();

const container = kernel.getContainer();
const store = container.get('redux.store');

ReactDOM.render((
  <BrowserRouter>
    <Provider>
      <App store={store}/>
    </Provider>
  </BrowserRouter>
),
document.getElementById('app'));  // Renders the root component to <div>
