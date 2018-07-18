import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Jumbotron, Tabs, Tab, Grid, Row, Col, Panel } from 'react-bootstrap';

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
                  <Col xs={12} md={6}>
                    <Panel bsStyle="info" defaultExpanded>
                      <Panel.Heading>
                        <Panel.Title toggle>Love Live SIF Twitter</Panel.Title>
                      </Panel.Heading>
                      <Panel.Collapse>
                        <Panel.Body>
                          <a className="twitter-timeline" data-width="450"
                             href="https://twitter.com/LLUpdates?ref_src=twsrc%5Etfw">Tweets by LLUpdates</a>
                        </Panel.Body>
                      </Panel.Collapse>
                    </Panel>
                  </Col>
                  <Col xs={12} md={6}>
                    <Panel bsStyle="info" defaultExpanded>
                      <Panel.Heading>
                        <Panel.Title toggle>New Cards List (SchoolIdo.lu)</Panel.Title>
                      </Panel.Heading>
                      <Panel.Collapse>
                        <Panel.Body>
                          Panel Content #2
                        </Panel.Body>
                      </Panel.Collapse>
                    </Panel>
                  </Col>
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
