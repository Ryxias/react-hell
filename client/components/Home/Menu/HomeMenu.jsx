import React from 'react';
import { Link } from 'react-router-dom';

const GachaMenu = () => {
  return (
    <div>
      <h3>Welcome Home!</h3>
      <nav>
        <Link to="/react/sif">Go to Gacha Roll</Link>
      </nav>
    </div>
  );
}

export default GachaMenu;
