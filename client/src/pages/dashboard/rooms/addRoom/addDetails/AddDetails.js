import { InputAdornment, Stack, TextField } from "@mui/material";
import { LocalizationProvider, MobileDatePicker } from "@mui/x-date-pickers";
import { useEffect, useState } from "react";
import { useValue } from "../../../../../context/ContextProvider";
import InfoField from "./InfoField";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import "dayjs/locale/en";

const AddDetails = () => {
  const {
    state: {
      details: { title, description, price, inDate },
    },
    dispatch,
  } = useValue();

  const [value, setValue] = useState(new Date());

  useEffect(() => {
    dispatch({ type: "UPDATE_DETAILS", payload: { inDate: value } });
  }, []);

  const handlePriceChange = (e) => {
    dispatch({ type: "UPDATE_DETAILS", payload: { price: e.target.value } });
  };

  const handleDateChange = (newValue) => {
    setValue(newValue);
    dispatch({ type: "UPDATE_DETAILS", payload: { inDate: newValue } });
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={"en"}>
      <Stack
        sx={{
          alignItems: "center",
          "& .MuiTextField-root": { width: "100%", maxWidth: 500, mt: 1 },
        }}
      >
        {" "}
        <Stack
          sx={{
            width: "100%",
            alignItems: "center",
            justifyContent: "left ",
            gap: 2,
            m: 0,
          }}
          direction="row"
        >
          <TextField
            sx={{ minWidth: "120px" }}
            variant="outlined"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">$</InputAdornment>
              ),
            }}
            inputProps={{ type: "number", min: 1, max: 500 }}
            value={price}
            onChange={handlePriceChange}
            name="amount"
            label="Amount"
          />
          <MobileDatePicker
            label="Date"
            inputFormat="MM/DD/YYYY"
            value={value}
            onChange={handleDateChange}
            renderInput={(params) => <TextField {...params} />}
          />
        </Stack>
        <InfoField
          mainProps={{ name: "title", label: "Title", value: title }}
          minLength={5}
        />
        <InfoField
          mainProps={{
            name: "description",
            label: "Description",
            value: description,
          }}
          minLength={10}
          optionalProps={{ multiline: true, rows: 4 }}
        />
      </Stack>
    </LocalizationProvider>
  );
};

export default AddDetails;
