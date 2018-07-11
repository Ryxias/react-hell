import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Jumbotron, Tabs, Tab } from 'react-bootstrap';

import { connect } from 'react-redux';

class SIFAggregatorContainer extends Component {
  constructor(props) {
    super(props);
  }

  render () {
    return (
      <div>

        <Jumbotron>
          <h1>SIF Aggregator</h1>
          <p>
            This is a page under construction and built for tools to help LLSIF gamers.
          </p>
        </Jumbotron>

        <Tabs>
          <Tab eventKey={1} title="News">
            Tab 1 Content
          </Tab>
          <Tab eventKey={2} title="Event Predictor">
            Tab 2 Content
          </Tab>
          <Tab eventKey={3} title="Event Points Calculator">
            Tab 3 Content
          </Tab>
          <Tab eventKey={4} title="Team Optimizer">
            Tab 4 Content
          </Tab>
        </Tabs>

      </div>
    );
  }
}

export default SIFAggregatorContainer;
