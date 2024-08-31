package com.amess.messbook.social.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class NicknameUpdateData {

    @NotNull
    // The  regex pattern follows the nickname policy of discord
    @Pattern(regexp = "^(?!.*(?:@|#|:|```))(?!everyone$)(?!here$)[\\w-]+$",
            message = "Invalid nickname format. nicknames cannot contain special characters such as '@', '#', ':', or triple backticks (`). Also, nicknames cannot be 'everyone' or 'here'")
    private String newNickname;

    @NotNull
    private String password;
}
