'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { loadGossipIndex, deleteGossip } from '../../actions/gossip_action_creators';
import GossipCell from './GossipCell.jsx';

class GossipIndex extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      loaded: false,
      page_number: 1,
      page_size: 21,
    };
  }

  render() {
    const cell_matrix = this.matrixifyGossips(this.props.gossips);

    return (
      <div className="container-fluid">
        {cell_matrix.map(row =>
          <div key={row[0].id} className="row">
            {row.map(gossip => {
              const props = {
                id: gossip.id,
                text: gossip.text,
                onRemoveClick: this.deleteGossip.bind(this, gossip.id),
              };
              return (
                <div key={gossip.id} className="col-md-4">
                  <GossipCell {...props} />
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  deleteGossip(id) {
    this.props.dispatch(deleteGossip(id));
  }

  matrixifyGossips(gossips) {
    const cell_matrix = [];

    let current_col = 0;
    let current_row = -1;
    gossips.forEach(gossip => {
      if (current_col === 0) {
        cell_matrix.push([]);
        current_row += 1;
      }
      cell_matrix[current_row].push(gossip);
      current_col += 1;
      if (current_col === 3) {
        current_col = 0;
      }
    });
    return cell_matrix
  }

  componentDidMount() {
    this.props.dispatch(loadGossipIndex(this.state.page_number, this.state.page_size));
  }

}

GossipIndex.propTypes = {
  gossips: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number,
    text: PropTypes.string,
  })),
};

GossipIndex.defaultProps = {
  gossips: [],
};

const mapStateToProps = (state, ownProps) => {
  return {
    gossips: state.gossip.gossips || [],
  };
};

export default connect(mapStateToProps)(GossipIndex);
