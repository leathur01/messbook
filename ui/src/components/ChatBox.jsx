import {
  Box,
  CircularProgress,
  Dialog,
  Grid,
  Paper,
  Stack,
  TextField,
} from "@mui/material";
import SideProfile from "./SideProfile";
import ProfileCard from "./ProfileCard";
import React, { useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";
import { useAuth } from "../provider/AuthProvider";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";

const initialChat = [];
const ChatBox = ({ value, index, friend, stompClient, user, newMessage }) => {
  const [viewProfile, setViewProfile] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState(friend);
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState(initialChat);
  const viewport = useRef(null);
  const { token } = useAuth();
  const scrollableRef = useRef(null);
  const [scrollHeight, setScrollHeight] = useState(0);
  const { ref, inView } = useInView();
  const messagesQuery = useInfiniteQuery({
    queryKey: ["messages", value, index],
    queryFn: async ({ pageParam }) => {
      if (value === index) {
        await new Promise((resolve) => setTimeout(resolve, 500));
        let response = await axios.get(
          `http://localhost:8080/messages/${friend.nickname}?page=${pageParam}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        return response.data;
      }
      return [];
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      return lastPage.number < lastPage.totalPages - 1
        ? lastPage.number + 1
        : undefined;
    },
    refetchOnWindowFocus: false,
  });

  // Avoid the scrollbar to scroll to the top when older messages are added to the top of the message history
  useEffect(() => {
    const scrollableElement = scrollableRef.current;
    if (scrollableElement && scrollHeight != scrollableElement.scrollHeight) {
      const diff = scrollableElement.scrollHeight - scrollHeight;

      if (diff) {
        setTimeout(() => {
          scrollableElement.scrollTo({
            top: diff,
          });
        }, 0);
      }

      setScrollHeight(scrollableElement.scrollHeight);
    }
  }, [scrollableRef, scrollHeight]);

  // Fetch older messages when user scroll to the top
  useEffect(() => {
    if (inView && messagesQuery.hasNextPage) {
      messagesQuery.fetchNextPage();
    }
  }, [messagesQuery, inView]);

  // Render messages receiver from the message broker
  useEffect(() => {
    if (
      newMessage.senderNickname === friend.nickname ||
      newMessage.receiverNickname === friend.nickname
    ) {
      const newChatMessage = {
        id: newMessage.id,
        senderNickname: newMessage.senderNickname,
        content: newMessage.content,
      };
      setChatHistory([newChatMessage, ...chatHistory]);
    }
  }, [newMessage]);

  // Reset the local chat history when open a new chat box which lead to fetching chat history from the server
  // This prevent the server data from conflicting with the local data
  useEffect(() => {
    if (value === index) {
      setChatHistory([]);
    }
  }, [value, index]);

  // Scroll to the bottom when new users send a new messages while they are viewing older messages
  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  const scrollToBottom = () => {
    viewport.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  };

  // React pattern to pass a function to a component wrapped with memo
  const handleOpenFriendProfile = useCallback(() => {
    setSelectedFriend(friend);
    setViewProfile(true);
  }, [friend]);

  // Send message when user press enter
  // Shift + Enter is used for line breaks
  const handleKeyDown = (event) => {
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
        setChatHistory([newChatMessage, ...chatHistory]);
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
              paddingTop: 0,
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
                direction="column-reverse"
                ref={scrollableRef}
                spacing={3}
                sx={{
                  flexGrow: 1,
                  overflow: "auto",
                  padding: "0px 10px 10px 0px",
                }}
              >
                <Box sx={{ marginTop: "0px" }} ref={viewport}></Box>

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

                {messagesQuery?.data?.pages.map((page, index) => {
                  return (
                    <React.Fragment key={index}>
                      {page.content.map((message, index) => {
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
                              {message.id + message.content}
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
                              {message.id + message.content}
                            </Box>
                          );
                        }
                      })}
                    </React.Fragment>
                  );
                })}

                <Box ref={ref}>
                  {messagesQuery.isFetchingNextPage && (
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <CircularProgress size={30} />
                    </Box>
                  )}
                </Box>
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
