import React, { Component } from 'react';
import { BrowserRouter } from 'react-router-dom';  // React Router v4

import MainLayout from './MainLayout/MainLayout.jsx';

class App extends Component {  // i.e extends React.Component
  constructor(props) {
    super(props);  // Receives access to props from higher-level components (might not be necessary here until Redux?)
  }

  render() {
    <BrowserRouter>
      <MainLayout />
    </BrowserRouter>
  }
}

export default App;