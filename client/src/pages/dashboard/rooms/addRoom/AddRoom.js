import { Close, Send } from "@mui/icons-material";
import {
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useValue } from "../../../../context/ContextProvider";
import AddDetails from "./addDetails/AddDetails";
import AddImages from "./addImages/AddImages";
import { createRoom, updateRoom } from "../../../../actions/room";

const AddRoom = () => {
  const {
    state: {
      images,
      details,
      currentUser,
      updatedRoom,
      deletedImages,
      openRoom,
    },
    dispatch,
  } = useValue();
  const [steps, setSteps] = useState([
    { label: "Details", completed: false },
    { label: "Images", completed: false },
  ]);
  const [showSubmit, setShowSubmit] = useState(false);

  const findUnfinished = () => {
    return steps.findIndex((step) => !step.completed);
  };

  useEffect(() => {
    if (images.length) {
      if (!steps[1].completed) setComplete(1, true);
    } else {
      if (steps[1].completed) setComplete(1, false);
    }
  }, [images]);

  useEffect(() => {
    if (details.title.length > 4 && details.description.length > 9) {
      if (!steps[0].completed) setComplete(0, true);
    } else {
      if (steps[0].completed) setComplete(0, false);
    }
  }, [details]);

  const setComplete = (index, status) => {
    setSteps((steps) => {
      steps[index].completed = status;
      return [...steps];
    });
  };
  useEffect(() => {
    if (findUnfinished() === -1) {
      if (!showSubmit) setShowSubmit(true);
    } else {
      if (showSubmit) setShowSubmit(false);
    }
  }, [steps]);

  const handleSubmit = () => {
    const room = {
      price: details.price,
      inDate: details.inDate,
      title: details.title,
      description: details.description,
      images,
    };
    if (updatedRoom)
      return updateRoom(
        room,
        currentUser,
        dispatch,
        updatedRoom,
        deletedImages
      );
    createRoom(room, currentUser, dispatch);
  };

  const handleClose = () => {
    dispatch({ type: "CLOSE_ROOM" });
  };

  return (
    <Dialog open={openRoom} onClose={handleClose}>
      <DialogTitle>
        Add new Expense
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
      <DialogContent dividers>
        <DialogContentText height={50} fontWeight="bold">
          Please fill your information in the fields below:
        </DialogContentText>
        <Container>
          <AddDetails />
          <AddImages />
          <DialogActions>
            {showSubmit && (
              <Button
                variant="contained"
                endIcon={<Send />}
                onClick={handleSubmit}
              >
                Save
              </Button>
            )}
          </DialogActions>
        </Container>
      </DialogContent>
    </Dialog>
  );
};

export default AddRoom;
