import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Col, Panel } from 'react-bootstrap';

import { connect } from 'react-redux';

import { fetchList, filterCards } from '../../modules/aggregator';
const aggregatorActions = { fetchList, filterCards };

class SIFNewCardsContainer extends Component {
  constructor(props) {
    super(props);

    this.props.fetchList()
      .then(() => {
        this.props.filterCards(this.props.cards.cards_data);
      });
  }

  render () {
    return (
      <Col xs={12} md={6}>
        <Panel bsStyle={null} className="panel-custom" defaultExpanded>
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
    );
  }
}

SIFNewCardsContainer.propTypes = {
  cards: PropTypes.object.isRequired,
  filtered_list: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => {
  return {
    cards: state.aggregator.cards,
    filtered_list: state.aggregator.filtered_list,
    loading: state.aggregator.loading,
  };
};

export default connect(mapStateToProps, { ...aggregatorActions })(SIFNewCardsContainer);
