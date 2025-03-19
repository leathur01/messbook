import { Box, Dialog, Grid, Paper, Stack, TextField } from "@mui/material";
import SideProfile from "./SideProfile";
import ProfileCard from "./ProfileCard";
import React, { useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";
import { useAuth } from "../provider/AuthProvider";
import { useQuery } from "@tanstack/react-query";

const initialChat = [];
const ChatBox = ({ value, index, friend, stompClient, user, newMessage }) => {
  const [viewProfile, setViewProfile] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState(friend);
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState(initialChat);
  const viewport = useRef(null);
  const { token } = useAuth();

  const messagesQuery = useQuery({
    queryKey: ["messages", value, index],
    queryFn: async () => {
      if (value === index) {
        let response = await axios.get(
          `http://localhost:8080/messages/${friend.nickname}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        return response.data;
      }
      return [];
    },
    refetchOnWindowFocus: false,
  });

  // Set chat messages if the query is success
  // Use this approache because the onSucess is removed from reactquery
  useEffect(() => {
    if (messagesQuery.isSuccess && messagesQuery.data.length !== 0) {
      setChatHistory(messagesQuery.data);
      console.log(messagesQuery.data);
    }
  }, [messagesQuery.data]);

  useEffect(() => {
    // Render messages receiver from the message broker
    if (
      newMessage.senderNickname === friend.nickname ||
      newMessage.receiverNickname === friend.nickname
    ) {
      const newChatMessage = {
        id: newMessage.id,
        senderNickname: newMessage.senderNickname,
        content: newMessage.content,
      };
      setChatHistory([...chatHistory, newChatMessage]);
    }
  }, [newMessage]);

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  const scrollToBottom = () => {
    viewport.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Scroll to the bottom when open chatbox
  const scrollRef = React.useCallback((node) => {
    node?.scrollIntoView({ behavior: "instant", block: "start" });
  }, []);

  // React pattern to pass a function to a component wrapped with memo
  const handleOpenFriendProfile = useCallback(() => {
    setSelectedFriend(friend);
    setViewProfile(true);
  }, [friend]);

  const handleKeyDown = (event) => {
    // Send message when user press enter
    // Shift + Enter is used for line breaks
    if (!event.shiftKey && event.key === "Enter") {
      event.preventDefault();
      if (message !== "" && stompClient && user) {
        const newMessage = {
          senderNickname: user.nickname,
          receiverNickname: friend.nickname,
          content: message,
        };
        setMessage("");
        stompClient.publish({
          destination: "/app/message",
          body: JSON.stringify(newMessage),
        });
        const newChatMessage = {
          id: 0,
          senderNickname: user.nickname,
          content: message,
        };
        setChatHistory([...chatHistory, newChatMessage]);
      }
    }
  };

  return (
    value === index && (
      <Grid container spacing={0}>
        <Grid item xs={9}>
          <Paper
            elevation={1}
            sx={{
              p: 3,
              paddingRight: 0,
              borderRadius: "0px",
              height: "100vh",
              boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px",
            }}
          >
            <Stack
              direction="column"
              sx={{
                height: "100%",
                justifyContent: "space-between",
              }}
            >
              <Stack
                spacing={3}
                sx={{
                  overflow: "auto",
                  padding: "0px 10px 10px 0px",
                }}
              >
                {chatHistory.map((message, index) => {
                  if (message.senderNickname === user.nickname) {
                    return (
                      <Box
                        sx={{
                          alignSelf: "flex-end",
                          borderRadius: "16px",
                          bgcolor: "#F3F3F3",
                          padding: "10px 20px",
                        }}
                        key={index}
                      >
                        {message.content}
                      </Box>
                    );
                  } else {
                    return (
                      <Box
                        sx={{
                          alignSelf: "flex-start",
                          borderRadius: "16px",
                          bgcolor: "#F3F3F3",
                          padding: "10px 20px",
                        }}
                        key={index}
                      >
                        {message.content}
                      </Box>
                    );
                  }
                })}

                <Box sx={{ height: "0.1px" }} ref={viewport}></Box>
                <span ref={scrollRef} />
              </Stack>

              <TextField
                id="outlined-basic"
                label="Outlined"
                variant="outlined"
                value={message}
                onChange={(event) => {
                  setMessage(event.target.value);
                }}
                multiline
                maxRows={4}
                onKeyDown={handleKeyDown}
                sx={{
                  marginTop: "12px",
                  marginRight: 3,
                }}
              />
            </Stack>
          </Paper>
        </Grid>

        <Grid item xs={3}>
          <SideProfile
            friend={friend}
            handleOpenProfile={handleOpenFriendProfile}
          />
        </Grid>

        <Dialog
          open={viewProfile}
          onClose={() => {
            setViewProfile(false);
            setSelectedFriend({});
          }}
        >
          {/* Prevent some data disapeare before the dialog is closed => increase UX */}
          {viewProfile && (
            <ProfileCard
              friend={selectedFriend}
              setSelectedFriend={setSelectedFriend}
            />
          )}
        </Dialog>
      </Grid>
    )
  );
};

export default ChatBox;
