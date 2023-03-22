import React, { useEffect, useState } from "react";
import { getFunds } from "../../../actions/fund";
import { useValue } from "../../../context/ContextProvider";
import Funds from "./Funds";

const Fund = ({ setSelectedLink, link }) => {
  const {
    state: { funds, currentUser },
    dispatch,
  } = useValue();

  useEffect(() => {
    setSelectedLink(link);
    if (funds.length === 0) getFunds(dispatch, currentUser);
  }, []);

  return (
      <Funds/>
  );
};

export default Fund;
