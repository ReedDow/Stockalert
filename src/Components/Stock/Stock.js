import React from "react";

import classes from "./Stock.module.css";


const StockDisplay = props => {
  const { symbol, price } = props.item;

  return (
    <div
      className={classes.Container}
     
    >
      <div className={classes.PriceContainer}>
        <span className={classes.Price}>{price}</span>
      </div>

      <div className={classes.Bottom}>
        <h3 className={classes.Title}>{symbol}</h3>
      </div>
    </div>
  );
};

export default StockDisplay;
