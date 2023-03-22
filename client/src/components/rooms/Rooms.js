import {
  Avatar,
  Card,
  Container,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  Tooltip,
} from "@mui/material";
import { useValue } from "../../context/ContextProvider";
import React, { useEffect } from "react";
import { getRooms } from "../../actions/room";

const Rooms = () => {
  const {
    state: { filteredRooms },
    dispatch,
  } = useValue();
  console.log(filteredRooms);

  useEffect(() => {
    getRooms(dispatch);
  }, []);
  return (
    <Container>
      <ImageList
        gap={12}
        sx={{
          mb: 8,
          gridTemplateColumns:
            "repeat(auto-fill, minmax(280px, 1fr))!important",
        }}
      >
        {filteredRooms.map((room) => (
          <Card key={room._id} sx={{ maxHeight: 350 }}>
            <ImageListItem sx={{ height: "100% !important" }}>
              <ImageListItemBar
                sx={{
                  background:
                    "linear-gradient(to bottom, rgba(0,0,0,0.7)0%, rgba(0,0,0,0.3)70%, rgba(0,0,0,0)100%)",
                }}
                title={room.price === 0 ? "Free Stay" : "$" + room.price}
                actionIcon={
                  <Tooltip title={room.uName} sx={{ mr: "5px" }}>
                    <Avatar src={room.uPhoto} />
                  </Tooltip>
                }
                position="top"
              />
              <img
                src={room.images[0]}
                alt={room.title}
                loading="lazy"
                style={{ cursor: "pointer" }}
                onClick={() => dispatch({ type: "UPDATE_ROOM", payload: room })}
              />
              <ImageListItemBar
                title={room.title}
              />
            </ImageListItem>
          </Card>
        ))}
      </ImageList>
    </Container>
  );
};

export default Rooms;
