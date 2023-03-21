import { Box, Fab, IconButton, Tooltip } from "@mui/material";
import { useEffect, useState } from "react";
import { Check, Delete, Save } from "@mui/icons-material";
import { green } from "@mui/material/colors";
import { useValue } from "../../../context/ContextProvider";
import { deleteFund, updateFund } from "../../../actions/fund";

const FundsActions = ({ params, rowId, setRowId }) => {
  const {
    dispatch,
    state: { currentUser },
  } = useValue();
  const [success, setSuccess] = useState(false);

  const handleSubmit = async () => {
    const result = await updateFund(params.row, currentUser, dispatch);
    if (result) {
      setRowId(null);
      setSuccess(true);
    }
  };

  useEffect(() => {
    if (rowId === params.id && success) setSuccess(false);
  }, [rowId]);
  return (
    <Box
      sx={{
        m: 1,
        position: "relative",
      }}
    >
      {success ? (
        <Fab
          color="primary"
          sx={{
            width: 40,
            height: 40,
            bgcolor: green[500],
            "&:hover": { bgcolor: green[700] },
          }}
        >
          <Check />
        </Fab>
      ) : (
        <Fab
          color="primary"
          sx={{
            width: 40,
            height: 40,
          }}
          disabled={params.id !== rowId}
          onClick={handleSubmit}
        >
          <Save />
        </Fab>
      )}
      <Tooltip title="Delete this fund">
        <IconButton
          onClick={() => deleteFund(params.row, currentUser, dispatch)}
        >
          <Delete />
        </IconButton>
      </Tooltip>
    </Box>
  );
};

export default FundsActions;
