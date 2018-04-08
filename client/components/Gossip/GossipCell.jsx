'use strict';

import React from 'react';
import PropTypes from 'prop-types';

const GossipCell = ({ id, text, onRemoveClick }) => {
  return (
    <div>
      [{id}] {text}
      <button type="button" onClick={onRemoveClick} className="btn btn-default btn-sm">
        <span className="glyphicon glyphicon-remove"></span> Remove
      </button>
    </div>
  );
};

GossipCell.propTypes = {
  id: PropTypes.number.isRequired,
  text: PropTypes.string.isRequired,

  //
  // openEditAction: PropTypes.func.isRequired,
  // completeEditAction: PropTypes.func.isRequired,
  //
  // isEditing: PropTypes.bool.isRequired,

  onRemoveClick: PropTypes.func.isRequired,
};

export default GossipCell;
