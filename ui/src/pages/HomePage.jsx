import React, { Fragment, useEffect, useState } from "react";
import {
  Stack,
  Tabs,
  Tab,
  Typography,
  Box,
  styled,
  Dialog,
  Alert,
} from "@mui/material";
import ConnectWithoutContactOutlinedIcon from "@mui/icons-material/ConnectWithoutContactOutlined";
import UserProfile from "./UserProfile";
import ChatBox from "../components/ChatBox";
import ProfileSettingButton from "../components/ProfileSettingButton";
import FriendPanelContainer from "../components/FriendPanelContainer";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { Navigate } from "react-router-dom";
import Loading from "./Loading";
import { useAuth } from "../provider/AuthProvider";
import LoadingButton from "../components/LoadingButton";
import NotificationStatus from "../components/NotificationStatus";
import { getToken, onMessage } from "firebase/messaging";
import { messaging } from "../notifications/firebase";
import { toast } from "react-toastify";
import NotificationToast from "../components/NotificationToast";
import AvatarImage from "../components/AvatarImage";
import { Client } from "@stomp/stompjs";

const { VITE_APP_VAPID_KEY } = import.meta.env;

let stompClient = null;
export default function HomePage() {
  const [chatTab, setChatTab] = React.useState(0);
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const { token, setIsActivated } = useAuth();
  const [isTokenValid, setIsTokenValid] = useState(true);
  const [notificationStatus, setNotificationStatus] = useState(
    Notification.permission
  );
  const [friends, setFriends] = useState([]);
  const [inComingRequests, setInComingRequests] = useState([]);
  const [outGoingRequests, setOutGoingRequests] = useState([]);
  const [inComingMessage, setInComingMessage] = useState({})

  onMessage(messaging, (payload) => {
    const notification = payload?.data;
    if (notification) {
      toast(
        <NotificationToast
          title={notification.title}
          body={notification.body}
        />,
        { position: "bottom-right" }
      );
    }
    console.log("Message received. ", payload);

    const fetchInComingRequests = async () => {
      try {
        let response = await axios.get(
          "http://localhost:8080/users/self/friends/requests?direction=incoming",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setInComingRequests(response.data);
      } catch (error) {
        setIsError(true);
      }
    };

    const fetchOutGoingRequests = async () => {
      try {
        let response = await axios.get(
          "http://localhost:8080/users/self/friends/requests?direction=outgoing",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setOutGoingRequests(response.data);

        response = await axios.get(`http://localhost:8080/users/self/friends`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFriends(response.data);
      } catch (error) {
        setIsError(true);
      }
    };

    if (notification.type === "SEND_FRIEND_REQUEST") {
      fetchInComingRequests();
    } else if (notification.type === "ACCEPT_FRIEND_REQUEST") {
      fetchOutGoingRequests();
    }
  });

  useEffect(() => {
    let decoded = jwtDecode(token);
    const fetchUser = async () => {
      setIsError(false);
      setIsLoading(true);
      try {
        let response = await axios.get(
          `http://localhost:8080/users/${decoded.sub}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const user = response.data;
        setUser(user);
        setIsActivated(user.activated);

        response = await axios.get(`http://localhost:8080/users/self/friends`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFriends(response.data);

        // Establish websocket connection for chat feature
        stompClient = new Client({
          brokerURL: "ws://localhost:8080/ws",
          debug: function (str) {
            console.log(str);
          },
          reconnectDelay: 10000,
          heartbeatIncoming: 4000,
          heartbeatOutgoing: 4000,
        });

        stompClient.onWebSocketError = (error) => {
          console.error("Error with websocket", error);
        };

        stompClient.onConnect = () => {
          stompClient.subscribe(
            "/user/" + user.nickname + "/messages",
            onMessageReceived
          );

          // set the user details including the message and the reciever
          // let chatMessage = {
          //   senderName: user.nickname,
          //   receiverName: user.nickname,
          //   message: "message send to myself",
          //   status: "MESSAGE",
          // };

          // console.log(stompClient);
          // // update the user message to empty string
          // stompClient.publish({
          //   destination: "/app/message",
          //   body: JSON.stringify(chatMessage),
          // });
        };

        stompClient.onStompError = (frame) => {
          console.log("Broker reported error: " + frame.headers["message"]);
          console.log("Additional details: " + frame.body);
        };

        stompClient.activate();
      } catch (error) {
        const tokenError = error.response?.data.errors.token;
        if (tokenError) {
          setIsTokenValid(false);
        } else {
          console.log(error);
          setIsError(true);
        }
      }
      // Make the user flow more ease
      setTimeout(() => {
        setIsLoading(false);
      }, 0.75 * 1000);
    };

    const sendDeviceToken = async () => {
      let permission = Notification.permission;
      if (!("Notification" in window)) {
        // Check if the browser supports notifications
        alert("This browser does not support desktop notification");
      } else if (permission === "default") {
        permission = await Notification.requestPermission();
        // Handle Default case, which the browser won't reload after choosing notification setting
        setNotificationStatus(permission);
      }
      if (permission === "granted") {
        try {
          // Ignore the 404 response from firebase after every notification permission reset or opt-in
          // Because Firebase tries to delete the old token when creating a new token but somehow the old token could not be found
          const deviceToken = await getToken(messaging, {
            vapidKey: VITE_APP_VAPID_KEY,
          });
          const response = await axios.post(
            "http://localhost:8080/users/devices",
            { deviceToken: deviceToken, userId: decoded.sub },
            { headers: { Authorization: `Bearer ${token}` } }
          );
          console.log(response.data);
          // Save the device token to send a delete request when logging out
          localStorage.setItem("deviceToken", deviceToken);
        } catch (error) {
          setIsError(true);
        }
      }
    };

    sendDeviceToken();
    fetchUser();
  }, []);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleCloseUserProfile = () => {
    setOpen(false);
  };

  const onMessageReceived = (payload) => {
    const newMessage = JSON.parse(payload.body)
    console.log(newMessage)
    setInComingMessage(newMessage) 
  };

  if (isError) return <Navigate to="/500" replace={true} />;
  if (isLoading) return <Loading />;

  return (
    <Fragment>
      <Box component="main">
        <Stack direction="row" gap={0}>
          <Stack direction="column" justifyContent="space-between">
            <Tabs
              orientation="vertical"
              value={chatTab}
              onChange={(event, newValue) => {
                setChatTab(newValue);
              }}
            >
              <StyledTab
                sx={{ alignItems: "flex-start", marginTop: "-1px" }}
                value={0}
                label={
                  <Stack direction="row" gap={1} alignItems="center">
                    <ConnectWithoutContactOutlinedIcon
                      fontSize="large"
                      sx={{ color: "#674188", width: 35, height: 35 }}
                    />
                    <Typography
                      sx={{
                        textTransform: "none",
                        color: "#674188",
                        fontWeight: "500",
                      }}
                    >
                      Friends
                    </Typography>
                  </Stack>
                }
              />

              {friends.map((friend, index) => (
                <StyledTab
                  sx={{ alignItems: "flex-start" }}
                  value={friend.id}
                  key={index}
                  label={
                    <Stack direction="row" gap={1} alignItems="center">
                      <AvatarImage user={friend} dot={true} />
                      <Typography
                        sx={{
                          textTransform: "none",
                        }}
                      >
                        {friend.nickname}
                      </Typography>
                    </Stack>
                  }
                />
              ))}
            </Tabs>

            <Stack>
              <Alert severity="" color="" variant="">
                <NotificationStatus
                  status={notificationStatus}
                  setNotificationStatus={setNotificationStatus}
                />
              </Alert>
              <ProfileSettingButton handleOpen={handleOpen} user={user} />
            </Stack>
          </Stack>

          <FriendPanelContainer
            user={user}
            value={chatTab}
            index={0}
            setFriends={setFriends}
            friends={friends}
            setChatTab={setChatTab}
            inComingRequests={inComingRequests}
            setInComingRequests={setInComingRequests}
            outGoingRequests={outGoingRequests}
            setOutGoingRequests={setOutGoingRequests}
            handleOpenUserProfile={() => {
              setOpen(true);
            }}
          />

          {/* Index + 1 is used to skip through the first friend tab */}
          {friends.map((friend, index) => (
            <ChatBox
              key={index}
              value={chatTab}
              index={friend.id}
              friend={friend}
              stompClient={stompClient}
              user={user}
              newMessage={inComingMessage}
            >
            </ChatBox>
          ))}
        </Stack>

        {open && (
          <UserProfile
            open={open}
            handleClose={handleCloseUserProfile}
            user={user}
            setUser={setUser}
            setIsLoading={setIsLoading}
            setIsError={setIsError}
          />
        )}
      </Box>

      <Dialog open={!isTokenValid}>
        <Box
          sx={{
            backgroundColor: "white",
            padding: 4,
            borderRadius: "10px",
          }}
        >
          <Typography
            sx={{
              fontSize: "25px",
              fontWeight: "400",
              textAlign: "center",
              marginBottom: "20px",
            }}
          >
            Your token has been expiered
            <br />
            or may have become invalid
          </Typography>
          <Stack direction="row" justifyContent="space-around">
            <LoadingButton isLogOut={true} />
          </Stack>
        </Box>
      </Dialog>
    </Fragment>
  );
}

const StyledTab = styled(Tab)(() => ({
  width: "270px",
  padding: "5px 80px 5px 10px",
  margin: "1px 0",
  transition: "all 0.2s ease-in-out",
  "&.Mui-selected": {
    backgroundColor: "#674188",
    "& p": {
      color: "white",
    },
    "& svg": {
      color: "white",
    },
  },
}));
