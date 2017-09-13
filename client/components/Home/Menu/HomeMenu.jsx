import React from 'react';
import { NavLink } from 'react-router-dom';

const GachaMenu = () => {
  return (
    <div>
      <nav>
        <NavLink to="/sif">Gacha Roll</NavLink>
      </nav>
    </div>
  );
}

export default GachaMenu;
