import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Col, Panel, OverlayTrigger, Popover } from 'react-bootstrap';

import { connect } from 'react-redux';

import { fetchList, filterCards } from '../../modules/aggregator';
const aggregatorActions = { fetchList, filterCards };

export class SIFNewCardsContainer extends PureComponent {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    this.props.fetchList()
      .then(() => {
        this.props.filterCards(this.props.cards.list);
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
              {this.props.filtered_list.length > 0 ?
                this.props.filtered_list.map(card => {
                  const gachaInfoOverlay = (
                    <Popover id="popover-trigger-click-root-close" title="Card Statistics">
                      <strong>Name:</strong> {card.name} <br/>
                      <strong>Collection:</strong> {card.translated_collection} <br/>
                      <strong>Attribute:</strong> {card.attribute} <br/>
                      <strong>Skill: [{card.skill}]</strong> {card.skill_details} <br/>
                      <strong>Center Skill: [{card.center_skill}]</strong> {card.center_skill_details} <br/>
                      <strong>Max Smile Points:</strong> {card.non_idolized_maximum_statistics_smile} ~ {card.idolized_maximum_statistics_smile} <br/>
                      <strong>Max Pure Points:</strong> {card.non_idolized_maximum_statistics_pure} ~ {card.idolized_maximum_statistics_pure} <br/>
                      <strong>Max Cool Points:</strong> {card.non_idolized_maximum_statistics_cool} ~ {card.idolized_maximum_statistics_cool} <br/>
                    </Popover>
                  );
                  return (
                    <Panel bsStyle={null} className="panel-custom" key={card.id}>
                      <a href={card.website_url}>
                        <Panel.Body className="card-images">
                          {card.image_url ? <img className="latest-card-unindolized" src={'https:' + card.image_url}/> : ''}
                          <img className="latest-card-idolized" src={'https:' + card.idolized_image_url}/>
                        </Panel.Body>
                      </a>
                      <OverlayTrigger trigger="click" rootClose placement="top" overlay={gachaInfoOverlay}>
                        <Panel.Footer className="footer-custom">
                          Click here for statistics
                        </Panel.Footer>
                      </OverlayTrigger>
                    </Panel>
                  );
                })
                :
                ""}
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
