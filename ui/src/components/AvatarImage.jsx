import { Avatar } from "@mui/material";
import React from "react";
import StyledBadge from "./StyledBadge";
import { getUserAvatarUrl } from "../services/userClient";

// Use memo to prevent fetching imgae multiple time unecessarily
const AvatarImage = React.memo(function AvatarImage({ user, dot }) {
    return (
        <StyledBadge dot={dot}>
            <Avatar src={getUserAvatarUrl(user.id)} />
        </StyledBadge >
    )
});

export default AvatarImage; 