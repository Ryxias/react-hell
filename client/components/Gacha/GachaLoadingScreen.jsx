'use strict';

import React from 'react';

const GachaLoadingScreen = () => {
  return (
    // Megumin is cool enough to deserve her own loading screen
    <div className="gacha-container">
      <div className="envelope-image-container">
        <img className="gacha-loading" src="/statics/i/loading.gif" />
      </div>
    </div>
  );
};

export default GachaLoadingScreen;

