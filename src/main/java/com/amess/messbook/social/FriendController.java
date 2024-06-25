package com.amess.messbook.social;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class FriendController {


    @GetMapping("users/{userId}/friends")
    public void viewFriends() {

    }
}
