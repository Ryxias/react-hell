import React from 'react';
import { Col, Panel } from 'react-bootstrap';

const SIFTwitterContainer = () => {
  return (
    <Col xs={12} md={6}>
      <Panel bsStyle={null} className="panel-custom" defaultExpanded>
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
  );
}

export default SIFTwitterContainer;
