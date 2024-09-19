import { Avatar } from "@mui/material";
import React from "react";
import StyledBadge from "./StyledBadge";
import { getUserAvatarUrl } from "../services/userClient";

// Use memo to prevent fetching imgae multiple time unecessarily
const AvatarImage = React.memo(function AvatarImage({ userId, dot }) {
    console.log('render')
    return (
        <StyledBadge dot={dot}>
            <Avatar src={getUserAvatarUrl(userId)} />
        </StyledBadge >
    )
});

export default AvatarImage; 