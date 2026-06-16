package com.buy.skyit.mail;

import com.buy.skyit.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class MailService {

    private final UserService userService;

    public void verifyUserEmail(String id, String email){

    }


}
