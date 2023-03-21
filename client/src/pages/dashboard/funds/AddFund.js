import { Close, Send } from "@mui/icons-material";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
} from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { useValue } from "../../../context/ContextProvider";
import { MobileDatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import "dayjs/locale/en";
import { IMaskInput } from "react-imask";
import { NumericFormat } from "react-number-format";
import Input from "@mui/material/Input";
import PropTypes from "prop-types";
import { createFund } from "../../../actions/fund";

const TextMaskCustom = React.forwardRef(function TextMaskCustom(props, ref) {
  const { onChange, ...other } = props;
  return (
    <IMaskInput
      {...other}
      mask="(000) 000-0000"
      definitions={{
        "#": /[1-9]/,
      }}
      inputRef={ref}
      onAccept={(value) => onChange({ target: { name: props.name, value } })}
      overwrite
    />
  );
});

TextMaskCustom.propTypes = {
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

const NumericFormatCustom = React.forwardRef(function NumericFormatCustom(
  props,
  ref
) {
  const { onChange, ...other } = props;

  return (
    <NumericFormat
      {...other}
      getInputRef={ref}
      onValueChange={(values) => {
        onChange({
          target: {
            name: props.name,
            value: values.value,
          },
        });
      }}
      thousandSeparator
      valueIsNumericString
      prefix="$"
    />
  );
});

NumericFormatCustom.propTypes = {
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

const AddFund = () => {
  const {
    state: { openFund, currentUser },
    dispatch,
  } = useValue();
  const nameRef = useRef();
  const emailRef = useRef();
  const descriptionRef = useRef();
  const [role, setRole] = useState("Member");
  const [value, setValue] = useState(new Date());
  const [values, setValues] = React.useState({
    phone: "(000) 000-0000",
    amount: "0",
  });

  const handleDateChange = (newValue) => {
    setValue(newValue);
  };

  const handleClose = () => {
    dispatch({ type: "CLOSE_FUND" });
  };

  const handleRoleChange = (event) => {
    setRole(event.target.value);
  };
  const handleChange = (event) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const fund = {
      name: nameRef.current.value,
      email: emailRef.current.value,
      description: descriptionRef.current.value,
      role: role,
      inDate: value,
      amount: values.amount,
      phoneNumber: values.phone,
    };
    createFund(fund, currentUser, dispatch);
  };

  useEffect(() => {
    setRole("Member");
    setValue(new Date());
    values.amount = "0";
    values.phone = "(000) 000-00000";
  }, []);

  return (
    <Dialog open={openFund} onClose={handleClose}>
      <DialogTitle>
        Add new Fund
        <IconButton
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            color: (theme) => theme.palette.grey[500],
          }}
          onClick={handleClose}
        >
          <Close />
        </IconButton>
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={"en"}>
          <DialogContent dividers>
            <DialogContentText height={50} fontWeight="bold">
              Please fill your information in the fields below:
            </DialogContentText>
            <Stack
              sx={{ alignItems: "center", justifyContent: "left", gap: 4 }}
              direction="row"
            >
              <FormControl sx={{ minWidth: 120 }}>
                <InputLabel required>Role</InputLabel>
                <Select
                  label="Role"
                  autoFocus
                  value={role}
                  onChange={handleRoleChange}
                >
                  <MenuItem value={"Member"}>Member</MenuItem>
                  <MenuItem value={"Guest"}>Guest</MenuItem>
                </Select>
              </FormControl>
              <MobileDatePicker
                label="Date"
                inputFormat="MM/DD/YYYY"
                value={value}
                onChange={handleDateChange}
                renderInput={(params) => <TextField {...params} />}
              />
              <TextField
                variant="outlined"
                label="Amount"
                value={values.amount}
                onChange={handleChange}
                name="amount"
                id="formatted-amount-input"
                InputProps={{
                  inputComponent: NumericFormatCustom,
                }}
                required
                sx={{ width: "15ch !important" }}
              />
            </Stack>
            <TextField
              margin="normal"
              variant="standard"
              id="name"
              label="Name"
              type="text"
              fullWidth
              inputRef={nameRef}
              inputProps={{ minLength: 2 }}
              required
            />
            <FormControl fullWidth variant="standard">
              <InputLabel htmlFor="formatted-text-mask-input">
                Phone Number
              </InputLabel>
              <Input
                value={values.phone}
                onChange={handleChange}
                name="phone"
                id="formatted-text-mask-input"
                inputComponent={TextMaskCustom}
              />
            </FormControl>
            <TextField
              margin="normal"
              variant="standard"
              id="email"
              label="Email"
              type="email"
              fullWidth
              inputRef={emailRef}
            />
            <TextField
              margin="normal"
              variant="standard"
              id="description"
              label="Description"
              type="text"
              fullWidth
              inputRef={descriptionRef}
              multiline={true}
              row={2}
            />
          </DialogContent>
          <DialogActions sx={{ px: "20px" }}>
            <Button type="submit" variant="contained" endIcon={<Send />}>
              Save
            </Button>
          </DialogActions>
        </LocalizationProvider>
      </form>
    </Dialog>
  );
};

export default AddFund;
