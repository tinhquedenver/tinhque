import fetchData from "./utils/fetchData";

const url = process.env.REACT_APP_SERVER_URL + "/fund";
export const getFunds = async (dispatch, currentUser) => {
  const result = await fetchData(
    { url, method: "GET", token: currentUser.token },
    dispatch
  );
  if (result) {
    dispatch({ type: "UPDATE_FUNDS", payload: result });
  }
};

export const createFund = async (fund, currentUser, dispatch) => {
  dispatch({ type: "START_LOADING" });

  const result = await fetchData(
    { url, body: fund, token: currentUser?.token },
    dispatch
  );
  if (result) {
    dispatch({
      type: "UPDATE_ALERT",
      payload: {
        open: true,
        severity: "success",
        message: "The fund has been added successfully",
      },
    });
    dispatch({ type: "CLOSE_FUND" });
    dispatch({ type: "UPDATE_FUND", payload: result });
    getFunds(dispatch, currentUser);
    dispatch({ type: "UPDATE_FUNDS", payload: result });
  }

  dispatch({ type: "END_LOADING" });
};

export const updateFund = async (fund, currentUser, dispatch) => {
  dispatch({ type: "START_LOADING" });

  const result = await fetchData(
    {
      url: `${url}/${fund._id}`,
      method: "PATCH",
      body: fund,
      token: currentUser?.token,
    },
    dispatch
  );
  if (result) {
    dispatch({
      type: "UPDATE_ALERT",
      payload: {
        open: true,
        severity: "success",
        message: "The room has been updated successfully",
      },
    });

    dispatch({ type: "UPDATE_FUND", payload: result });
  }

  dispatch({ type: "END_LOADING" });
  return result
};

export const deleteFund = async (fund, currentUser, dispatch) => {
  dispatch({ type: "START_LOADING" });

  const result = await fetchData(
    { url: `${url}/${fund._id}`, method: "DELETE", token: currentUser?.token },
    dispatch
  );
  if (result) {
    dispatch({
      type: "UPDATE_ALERT",
      payload: {
        open: true,
        severity: "success",
        message: "The fund has been deleted successfully",
      },
    });
    dispatch({ type: "DELETE_FUND", payload: result._id });
  }
  dispatch({ type: "END_LOADING" });
};
