'use strict';

import React from 'react';
import PropTypes from 'prop-types';

const GossipIndexPaginator = ({ pages }) => {
  return (
    <nav aria-label="Gossips">
      <ul className="pagination">
        {
          pages.map(row => {
            const classes = `page-item ${row.active ? 'active' : ''} ${row.disabled ?  'disabled' : ''}`;
            return (
              <li key={row.page_number} className={classes}>
                <a className="page-link" href="#" onClick={row.onClick}>{row.title}</a>
              </li>
            );
          })
        }
      </ul>
    </nav>
  );
};

GossipIndexPaginator.propTypes = {
  pages: PropTypes.arrayOf(PropTypes.shape({
    page_number: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    active: PropTypes.bool.isRequired,
    disabled: PropTypes.bool.isRequired,
    onClick: PropTypes.func.isRequired,
  })).isRequired,
};

export default GossipIndexPaginator;
