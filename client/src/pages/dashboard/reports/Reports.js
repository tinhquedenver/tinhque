import { BalanceOutlined } from "@mui/icons-material";
import {
  Box,
  Divider,
  Paper,
  ToggleButtonGroup,
  ToggleButton,
  Typography,
  TextField,
  Stack,
  Tooltip,
  Avatar,
} from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import { getRooms } from "../../../actions/room";
import { useValue } from "../../../context/ContextProvider";
import moment from "moment";
import { getFunds } from "../../../actions/fund";
import { currencyFormat } from "../utils/Currency";
import { LocalizationProvider, MobileDatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DataGrid, gridClasses } from "@mui/x-data-grid";
import { grey } from "@mui/material/colors";

const Reports = ({ setSelectedLink, link }) => {
  const {
    state: { rooms, funds, reportRooms, reportFunds, currentUser },
    dispatch,
  } = useValue();

  const [pageSize, setPageSize] = useState(5);
  const [alignment, setAlignment] = useState("year");
  const [isRange, setIsRange] = useState(false);
  const [reportTitle, setReportTitle] = useState();
  const [dateFrom, setDateFrom] = useState(new Date());
  const [dateTo, setDateTo] = useState(new Date());
  const [expense, setExpense] = useState(0);
  const [fund, setFund] = useState(0);
  const [balance, setBalance] = useState(0);
  const [totalBalance, setTotalBalance] = useState(0);

  const handleChange = (event, newAlignment) => {
    setAlignment(newAlignment);
    if (newAlignment === null) return null;
    if (newAlignment === "range") {
      setDateFrom(new Date());
      setDateTo(new Date());
      setIsRange(true);
    } else {
      setIsRange(false);
    }
    setTitle(newAlignment);
  };

  const setTitle = (dateRange, action = 0) => {
    let sDate = new Date();
    let eDate = new Date();
    switch (dateRange) {
      case "year":
        sDate.setMonth(sDate.getMonth() - 12);
        setDateFrom(sDate);
        setDateTo(eDate);
        setDetailData(sDate, eDate);
        setReportTitle(
          "Last year (" +
            sDate.toLocaleDateString() +
            " to " +
            eDate.toLocaleDateString() +
            ")"
        );
        return;
      case "3months":
        sDate.setMonth(sDate.getMonth() - 3);
        setDateFrom(sDate);
        setDateTo(eDate);
        setReportTitle(
          "Last 3 months (" +
            sDate.toLocaleDateString() +
            " to " +
            eDate.toLocaleDateString() +
            ")"
        );
        setDetailData(sDate, eDate);
        return;
      case "month":
        sDate.setMonth(sDate.getMonth() - 1);
        setDateFrom(sDate);
        setDateTo(eDate);
        setReportTitle(
          "Last month (" +
            sDate.toLocaleDateString() +
            " to " +
            eDate.toLocaleDateString() +
            ")"
        );
        setDetailData(sDate, eDate);
        return;
      case "range":
        setReportTitle(
          "Date selected (" +
            new Date(dateFrom).toLocaleDateString() +
            " to " +
            new Date(dateTo).toLocaleDateString() +
            ")"
        );
        if (action === 1) {
          sDate = dateFrom;
          eDate = dateTo;
        }
        setDetailData(sDate, eDate);
        return;
      default:
        throw new Error("No matched action!");
    }
  };

  const dateCheck = () => {
    if (dateFrom > dateTo) {
      dispatch({
        type: "UPDATE_ALERT",
        payload: {
          open: true,
          severity: "error",
          message: "Date From must be smaller than Date To",
        },
      });
      return false;
    }
  };

  const setDetailData = async (startDate, endDate) => {
    dispatch({ type: "REPORT_ROOMS_FILTER", payload: [startDate, endDate] });
    dispatch({ type: "REPORT_FUNDS_FILTER", payload: [startDate, endDate] });

   /*  setExpense(reportRooms.reduce((a, v) => (a = a + v.price), 0));
    setFund(reportFunds.reduce((a, v) => (a = a + v.amount), 0));
    setBalance(
      reportFunds.reduce((a, v) => (a = a + v.amount), 0) -
        reportRooms.reduce((a, v) => (a = a + v.price), 0)
    ); */
  };
console.log(rooms)
console.log(reportRooms)
  useEffect(() => {
    setSelectedLink(link);
  }, []);

  useEffect(() => {
    if (rooms.length === 0) getRooms(dispatch);
    if (funds.length === 0) getFunds(dispatch, currentUser);
    setTotalBalance(
      funds.reduce((a, v) => (a = a + v.amount), 0) -
        rooms.reduce((a, v) => (a = a + v.price), 0)
    );
    setTitle("year");
  }, [rooms, funds]);

    useEffect(() => {
      setExpense(reportRooms.reduce((a, v) => (a = a + v.price), 0));
      setFund(reportFunds.reduce((a, v) => (a = a + v.amount), 0));
      setBalance(
        reportFunds.reduce((a, v) => (a = a + v.amount), 0) -
          reportRooms.reduce((a, v) => (a = a + v.price), 0)
      );
  }, [reportRooms, reportFunds]); 

  const handleDateFromChange = async (newValue) => {
    setDateFrom(newValue);
  };
  const handleDateToChange = async (newValue) => {
    setDateTo(newValue);
  };

  const handleDateFromAccept = async () => {
    setTitle("range", 1);
    if (!dateCheck()) return;
  };

  const handleDateToAccept = async () => {
    setTitle("range", 1);
    if (!dateCheck()) return;
  };

  //grid fund
  const fundColumns = useMemo(
    () => [
      {
        field: "name",
        headerName: "Name",
        width: 170,
        editable:false,
      },
      {
        field: "role",
        headerName: "Role",
        width: 100,
        type: "singleSelect",
        valueOptions: ["Member", "Guest"],
        editable:false,
      },
      {
        field: "amount",
        headerName: "Amount",
        width: 70,
        type: "number",
        renderCell: (params) => "$" + params.row.amount,
        editable: false,
      },
      {
        field: "inDate",
        headerName: "Date",
        width: 100,
        type: "date",
        renderCell: (params) => moment(params.row.inDate).format("YYYY-MM-DD"),
      },
      {
        field: "uName",
        headerName: "Added by",
        width: 80,
        renderCell: (params) => (
          <Tooltip title={params.row.uName}>
            <Avatar src={params.row.uPhoto} />
          </Tooltip>
        ),
      },
      { field: "_id", hide: true },
    ],
    []
  );
  //grid expense
  const expenseColumns = useMemo(
    () => [
      {
        field: "images",
        headerName: "Photo",
        width: 70,
        renderCell: (params) => (
          <Avatar src={params.row.images[0]} variant="rounded" />
        ),
        sortable: false,
        filterable: false,
      },
      {
        field: "price",
        headerName: "Cost",
        width: 70,
        renderCell: (params) => "$" + params.row.price,
      },
      { field: "title", headerName: "Title", width: 170 },
      {
        field: "inDate",
        headerName: "Date",
        width: 180,
        type: "date",
        renderCell: (params) => moment(params.row.inDate).format("YYYY-MM-DD"),
      },
      { field: "_id", hide: true },
    ],
    []
  );

  return (
    <Box
      sx={{
        textAlign: "center",
        width: "100%",
      }}
    >
      <Paper elevation={3} sx={{ p: 1, mb: 1 }}>
        <Typography variant="h4">Total Balance</Typography>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <BalanceOutlined
            sx={{ height: 100, width: 100, opacity: 0.3, mr: 1 }}
          />
          <Typography variant="h4">{currencyFormat(totalBalance)}</Typography>
        </Box>
      </Paper>

      <Paper elevation={3} sx={{ p: 2, gridColumn: "1/3" }}>
        <Box display="flex" justifyContent={"center"}>
          <ToggleButtonGroup
            color="primary"
            value={alignment}
            exclusive
            onChange={handleChange}
            aria-label="Platform"
          >
            <ToggleButton value="year">Last Year</ToggleButton>
            <ToggleButton value="3months">Last 3 Months</ToggleButton>
            <ToggleButton value="month">Last Month</ToggleButton>
            <ToggleButton value="range">Customize Date</ToggleButton>
          </ToggleButtonGroup>

          <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={"en"}>
            <MobileDatePicker
              disabled={!isRange}
              label="Date From"
              inputFormat="MM/DD/YYYY"
              value={dateFrom}
              onChange={handleDateFromChange}
              onAccept={handleDateFromAccept}
              renderInput={(params) => (
                <TextField {...params} sx={{ width: "120px", ml: "10px" }} />
              )}
            />

            <MobileDatePicker
              disabled={!isRange}
              label="Date To"
              inputFormat="MM/DD/YYYY"
              value={dateTo}
              onChange={handleDateToChange}
              onAccept={handleDateToAccept}
              renderInput={(params) => (
                <TextField {...params} sx={{ width: "120px", ml: "10px" }} />
              )}
            />
          </LocalizationProvider>
        </Box>
        <Divider sx={{ mt: 3, mb: 3, opacity: 0.7 }} />
        <Box>
          <Stack>
            <Typography mb={"10px"} variant="h4">
              {reportTitle}
            </Typography>
            <Box
              justifyContent={"center"}
              sx={{ display: "flex", gap: 3, flexWrap: "wrap" }}
            >
              <Stack alignItems="center" spacing={1}>
                <Box sx={{ width: 60, height: 20, background: "#FF8042" }} />
                <Typography variant="body">
                  Expenses: {currencyFormat(expense)}
                </Typography>
              </Stack>

              <Stack alignItems="center" spacing={1}>
                <Box sx={{ width: 60, height: 20, background: "#00C49F" }} />
                <Typography variant="body">
                  Funds: {currencyFormat(fund)}
                </Typography>
              </Stack>

              <Stack alignItems="center" spacing={1}>
                <Box sx={{ width: 60, height: 20, background: "#FC7789" }} />
                <Typography variant="body">
                  Balance: {currencyFormat(balance)}
                </Typography>
              </Stack>
            </Box>
          </Stack>
        </Box>
        <Divider sx={{ mt: 3, mb: 3, opacity: 0.7 }} />
        <Box
          sx={{
            display: { xs: "row", md: "flex" },
            gap: 4,
          }}
        >
          <Box sx={{ height: 415, width: "100%", pb: 5 }}>
            Expense Data
            <DataGrid
              columns={expenseColumns}
              rows={reportRooms}
              rowSpacingType="border"
              getRowId={(row) => row._id}
              rowsPerPageOptions={[5, 10, 20]}
              pageSize={pageSize}
              onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
              sx={{
                [`& .${gridClasses.row}`]: {
                  bgcolor: (theme) =>
                    theme.palette.mode === "light" ? grey[100] : grey[900],
                },
              }}
            />
          </Box>

          <Box sx={{ height: 415, width: "100%", pb: 5 }}>
            Fund Data
            <DataGrid
              columns={fundColumns}
              rows={reportFunds}
              rowSpacingType="border"
              getRowId={(row) => row._id}
              rowsPerPageOptions={[5, 10, 20]}
              pageSize={pageSize}
              onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
              sx={{
                [`& .${gridClasses.row}`]: {
                  bgcolor: (theme) =>
                    theme.palette.mode === "light" ? grey[100] : grey[900],
                },
              }}
            />
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default Reports;
