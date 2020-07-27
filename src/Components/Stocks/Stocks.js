import React from "react";
import Stock from "../Stock/Stock";
import classes from "./Stocks.module.css";

const Stocks = ({ list }) => {
  let cards = <h3>Loading...</h3>
  if (list) {
    cards = list.map((m, i) => <Stock key={i} item={m} />);
  }

  return (
    <div className={classes.Container}>
      <div className={classes.ContainerInner}>{cards}</div>
    </div>
  );
};

export default Stocks;