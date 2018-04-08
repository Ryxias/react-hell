'use strict';

import React from 'react';
import PropTypes from 'prop-types';

const GossipCell = ({ id, text, onRemoveClick }) => {
  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-sm-8 well">{text}</div>
        <div className="col-sm-4">
          <button type="button" onClick={onRemoveClick} className="btn btn-danger btn-sm">
            <span className="glyphicon glyphicon-remove"></span> Remove
          </button>
        </div>
      </div>
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
