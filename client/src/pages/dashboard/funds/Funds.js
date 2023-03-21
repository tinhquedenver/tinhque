import { useEffect, useMemo, useState } from "react";
import { Avatar, Box, Button, Tooltip, Typography } from "@mui/material";
import { DataGrid, gridClasses } from "@mui/x-data-grid";
import { useValue } from "../../../context/ContextProvider";
import { getFunds } from "../../../actions/fund";
import moment from "moment";
import { grey } from "@mui/material/colors";
import FundsActions from "../funds/FundsActions";
import { Add } from "@mui/icons-material";

const Funds = () => {
  const {
    state: {funds, currentUser },
    dispatch,
  } = useValue();

  const [pageSize, setPageSize] = useState(5);
  const [rowId, setRowId] = useState(null);

  useEffect(() => {
   getFunds(dispatch, currentUser);
  }, []); 

  const columns = useMemo(
    () => [
      {
        field: "name",
        headerName: "Name",
        width: 170,
      },
      {
        field: "role",
        headerName: "Role",
        width: 100,
        type: "singleSelect",
        valueOptions: ["Member", "Guest"],
        editable: currentUser?.role === "admin",
      },
      { field: "phoneNumber", headerName: "Phone Number", width: 170 },
      { field: "email", headerName: "Email", width: 200 },
      {
        field: "inDate",
        headerName: "Date",
        width: 100,
        type: "date",
        renderCell: (params) =>
          moment(params.row.inDate).format("YYYY-MM-DD HH:MM:SS"),
        editable: currentUser?.role === "admin",
      },
      {
        field: "amount",
        headerName: "Amount",
        width: 70,
        type: "number",
        renderCell: (params) => "$" + params.row.amount,
        editable: currentUser?.role === "admin",
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
      {
        field: "createdAt",
        headerName: "Created At",
        width: 200,
        renderCell: (params) =>
          moment(params.row.createdAt).format("YYYY-MM-DD HH:MM:SS"),
      },
      {
        field: "actions",
        headerName: "Actions",
        type: "actions",
        renderCell: (params) => (
          <FundsActions {...{ params, rowId, setRowId }} />
        ),
      },
    ],
    [rowId]
  );

  return (
    <Box
      sx={{
        height: 420,
        width: "100%",
      }}
    >
      <Typography
        variant="h3"
        component="h3"
        sx={{ textAlign: "center", mt: 3, mb: 3 }}
      >
        Manage Funds
      </Typography>
      <Tooltip title="Add new fund">
        <Button variant="h3" endIcon={<Add />} onClick={() => dispatch({ type: 'OPEN_FUND' })}>
          Add New
        </Button>
      </Tooltip>
      <DataGrid
        columns={columns}
        rows={funds}
        rowSpacingType="border"
        getRowId={(row) => row._id}
        rowsPerPageOptions={[5, 10, 20]}
        pageSize={pageSize}
        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
        getRowSpacing={(params) => ({
          top: params.isFirstVisible ? 0 : 5,
          bottom: params.isLastVisible ? 0 : 5,
        })}
        sx={{
          [`& .${gridClasses.row}`]: {
            bgcolor: (theme) =>
              theme.palette.mode === "light" ? grey[200] : grey[900],
          },
        }}
        onCellEditCommit={(params) => setRowId(params.id)}
      />
    </Box>
  );
};

export default Funds;
