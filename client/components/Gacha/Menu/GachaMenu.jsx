import React from 'react';
import { Link } from 'react-router-dom';

const GachaMenu = () => {
  return (
    <div>
      <h3>Welcome to Gacha Roll!</h3>
      <nav>
        <Link to="/react">Go Home</Link>
      </nav>
    </div>
  );
}

export default GachaMenu;
