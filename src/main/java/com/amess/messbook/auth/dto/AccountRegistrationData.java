package com.amess.messbook.auth.dto;

import com.amess.messbook.util.validation.DateOfBirthConstraint;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Setter
@Getter
@AllArgsConstructor
public class AccountRegistrationData {

    @NotNull
    // The  regex pattern follows the nickname policy of discord
    @Pattern(regexp = "^(?!.*(?:@|#|:|```))(?!everyone$)(?!here$)[\\w-]+$",
            message = "Invalid nickname format. nicknames cannot contain special characters such as '@', '#', ':', or triple backticks (`). Also, nicknames cannot be 'everyone' or 'here'")
    private String nickname;

    @NotNull
    @Email(message = "Please enter a valid email")
    private String email;

    @NotNull
    @Size(min = 12, max = 128,
            message="Password should be at least 8 and no more than 128 characters")
    private String password;

    // Tham dinh dang dien thoai o wiki va trang sau
    // https://thuvienphapluat.vn/phap-luat/ho-tro-phap-luat/danh-sach-dau-so-dien-thoai-viet-nam-cua-cac-nha-mang-hien-nay-ma-vung-so-dien-thoai-viet-nam-la-ba-576719-134504.html#google_vignette
    @Pattern(regexp = "^(\\+84|0)(3|5|7|8|9)[0-9]{8}$", message = "Please enter a valid phone number")
    private String phoneNumber;

    @NotNull
    @DateOfBirthConstraint
    private LocalDate dateOfBirth;
}
