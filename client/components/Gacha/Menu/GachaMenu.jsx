import React from 'react';
import { NavLink } from 'react-router-dom';

const GachaMenu = () => {
  return (
    <div>
      <h1>Gacha Roll!</h1>
      <nav>
        <NavLink to="/home">Home</NavLink>
      </nav>
    </div>
  );
}

export default GachaMenu;
