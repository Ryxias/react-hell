'use strict';

import React from 'react';
import PropTypes from 'prop-types';

const GossipCell = ({ id, text }) => {
  return (
    <div>
      [{id}] {text}
    </div>
  );
};

GossipCell.propTypes = {
  id: PropTypes.number.isRequired,
  text: PropTypes.number.isRequired,

  //
  // openEditAction: PropTypes.func.isRequired,
  // completeEditAction: PropTypes.func.isRequired,
  //
  // isEditing: PropTypes.bool.isRequired,
};

export default GossipCell;
