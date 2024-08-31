package com.amess.messbook.social.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class FriendRequestData {

    @NotNull
    @Pattern(regexp = "^(?!.*(?:@|#|:|```))(?!everyone$)(?!here$)[\\w-]+$",
            message = "Hm, didn't work. Double check that the username is correct."
    )
    private String nickname;
}
