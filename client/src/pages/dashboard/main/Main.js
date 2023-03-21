import { PaymentsOutlined, SavingsOutlined } from "@mui/icons-material";
import {
  Avatar,
  Box,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { getRooms } from "../../../actions/room";
import { useValue } from "../../../context/ContextProvider";
import moment from "moment";
import PieRoomsCost from "./PieRoomsCost";
import AreaRoomsUsers from "./AreaRoomsUsers";
import { getFunds } from "../../../actions/fund";
import { currencyFormat } from "../utils/Currency";

const Main = ({ setSelectedLink, link }) => {
  const {
    state: { rooms, funds, currentUser },
    dispatch,
  } = useValue();

  const [totalExpenses, setTotalExpenses] = useState(0);
  const [totalFunds, setTotalFunds] = useState(0);

  useEffect(() => {
    setSelectedLink(link);
  }, []);

  useEffect(() => {
    if (rooms.length === 0) getRooms(dispatch);
    if (funds.length === 0) getFunds(dispatch, currentUser);
    setTotalFunds(funds.reduce((a, v) => (a = a + v.amount), 0))
    setTotalExpenses(rooms.reduce((a, v) => (a = a + v.price), 0))
  }, [rooms, funds]);

  return (
    <Box
      sx={{
        display: { xs: "flex", md: "grid" },
        gridTemplateColumns: "repeat(3,1fr)",
        gridAutoRows: "minmax(100px, auto)",
        gap: 3,
        textAlign: "center",
        flexDirection: "column",
      }}
    >
      <Paper elevation={3} sx={{ p: 1 }}>
        <Typography variant="h4">Total Expenses</Typography>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <PaymentsOutlined
            sx={{ height: 100, width: 100, opacity: 0.3, mr: 1 }}
          />
          <Box display={'row'}>
          <Typography variant="h4">{rooms.length}</Typography>
        <Divider sx={{opacity: 1 }} />
          <Typography variant="h4">{currencyFormat(totalExpenses)}</Typography>
          </Box>
        </Box>
      </Paper>
      <Paper elevation={3} sx={{ p: 1 }}>
        <Typography variant="h4">Total Funds</Typography>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <SavingsOutlined
            sx={{ height: 100, width: 100, opacity: 0.3, mr: 1 }}
          />
          <Box display={'row'}>
          <Typography variant="h4">{funds.length}</Typography>
        <Divider sx={{opacity: 1 }} />
          <Typography variant="h4">{currencyFormat(totalFunds)}</Typography>
          </Box>
        </Box>
      </Paper>
      <Paper elevation={3} sx={{ p: 2, gridColumn: 3, gridRow: "1/3" }}>
        <Box>
          <Typography variant="h6">Recently added Expenses</Typography>
          <List>
            {rooms.slice(0, 4).map((room, i) => (
              <Box key={room._id}>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar
                      alt={room?.title}
                      src={room?.images[0]}
                      variant="rounded"
                    />
                  </ListItemAvatar>
                  <ListItemText
                    primary={room?.title + ": $" + room?.price}
                    secondary={`Added: ${moment(room?.createdAt).fromNow()}`}
                  />
                </ListItem>
                {i !== 3 && <Divider variant="inset" />}
              </Box>
            ))}
          </List>
        </Box>
        <Divider sx={{ mt: 3, mb: 3, opacity: 0.7 }} />
        <Box>
          <Typography variant="h6">Recently added Funds</Typography>
          <List>
            {funds.slice(0, 4).map((fund, i) => (
              <Box key={fund._id}>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar
                      alt={fund?.name}
                      src={fund?.uPhoto}
                      variant="rounded"
                    />
                  </ListItemAvatar>
                  <ListItemText
                    primary={`${fund?.name}:  $${fund.amount}`}
                    secondary={`Added: ${moment(fund?.createdAt).fromNow()}`}
                  />
                </ListItem>
                {i !== 3 && <Divider variant="inset" />}
              </Box>
            ))}
          </List>
        </Box>
      </Paper>
      <Paper elevation={3} sx={{ p: 2, gridColumn: "1/3" }}>
        <PieRoomsCost />
        <Divider sx={{ mt: 3, mb: 3, opacity: 0.7 }} />
        <AreaRoomsUsers />
      </Paper>
    </Box>
  );
};

export default Main;
