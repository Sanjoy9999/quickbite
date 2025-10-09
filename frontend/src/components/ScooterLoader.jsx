import React from 'react';
import scooter from '../assets/scooter.png';
import './scooterLoader.css';

// Single centered scooter loader. speed is seconds (default 4s for good visibility)
const ScooterLoader = ({ size = 140, speed = 5 }) => {
  const style = {
    '--loader-size': `${size}px`,
    '--loader-speed': `${speed}s`,
  };

  return (
    <div className="scooter-loader" style={style}>
      <img src={scooter} alt="loading" className="scooter-img" style={{ width: `var(--loader-size)` }} />
    </div>
  );
};

export default ScooterLoader;
