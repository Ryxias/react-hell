import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Jumbotron, Tabs, Tab, Grid, Row, Col, Panel } from 'react-bootstrap';

import SIFTwitterContainer from './SIFTwitterContainer.jsx';
import SIFNewCardsContainer from './SIFNewCardsContainer.jsx';

import { connect } from 'react-redux';

class SIFAggregatorContainer extends Component {
  constructor(props) {
    super(props);
  }

  render () {
    return (
      <div>
        <link rel="stylesheet" href="/statics/css/aggregator.css"/>
        <Jumbotron>
          <h1>SIF Info Aggregator</h1>
          <p>
            Built for tools to help Love Live! School Idol Festival players.
          </p>
        </Jumbotron>

        <Tabs id="sif-tabs">
          <Tab eventKey={1} title="News">
            <div className="news-container">
              <Grid>
                <Row>
                  <SIFTwitterContainer />
                  <SIFNewCardsContainer />
                </Row>
              </Grid>
            </div>
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
