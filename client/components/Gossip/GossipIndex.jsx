'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { loadGossipIndex, deleteGossip } from '../../actions/gossip_action_creators';
import GossipCell from './GossipCell.jsx';

const PAGE_SIZE = 21;

class GossipIndex extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      loaded: false,
      page_number: 1,
    };
  }

  render() {
    const { page, page_count, gossips } = this.props;

    const cell_matrix = this._matrixifyGossips(gossips);

    const pages = (new Array(page_count)).fill().map((_, i) => {
      const page_number = i + 1;
      const title = page_number;
      const active = page === page_number;
      const disabled = false;

      return {
        page_number,
        title,
        active,
        disabled,
      };
    });

    return (
      <div className="container-fluid">
        <nav aria-label="Gossips">
          <ul className="pagination">
            {
              pages.map(row => {
                const onClick = (e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  this.setState({ page_number: row.page_number });
                  this.handleLoadGossips(row.page_number);
                };
                const classes = `page-item ${row.active ? 'active' : ''} ${row.disabled ?  'disabled' : ''}`;
                return (
                  <li className={classes}>
                    <a className="page-link" href="#" onClick={onClick}>{row.title}</a>
                  </li>
                );
              })
            }
          </ul>
        </nav>
        {cell_matrix.map(row =>
          <div key={row[0].id} className="row">
            {row.map(gossip => {
              const props = {
                id: gossip.id,
                text: gossip.text,
                onRemoveClick: () => this.handleDeleteGossip(gossip.id),
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

  handleLoadGossips(page_number) {
    this.props.dispatch(loadGossipIndex(page_number, PAGE_SIZE));
  }

  handleDeleteGossip(id) {
    this.props.dispatch(deleteGossip(id));
  }

  _matrixifyGossips(gossips) {
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
    this.handleLoadGossips(this.state.page_number);
  }
}

GossipIndex.propTypes = {
  gossips: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number,
    text: PropTypes.string,
  })),
  page: PropTypes.number,
  page_count: PropTypes.number,
};

GossipIndex.defaultProps = {
  gossips: [],
  page: 1,
  page_count: 1,
};

const mapStateToProps = (state, ownProps) => {
  return {
    gossips: state.gossip.gossips,
    page: state.gossip.page,
    page_count: state.gossip.page_count,
  };
};

export default connect(mapStateToProps)(GossipIndex);
