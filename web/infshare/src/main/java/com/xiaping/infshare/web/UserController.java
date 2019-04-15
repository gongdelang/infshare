package com.xiaping.infshare.web;


import com.xiaping.infshare.dto.Result;
import com.xiaping.infshare.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/userController")
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping(value = "/login")
    public Result login(
        @RequestParam("code") String code
    ){
        return userService.login(code);
    }

    @GetMapping(value = "/checkToken")
    public Result checkToken(
        @RequestParam(defaultValue = "") String token
    ){
        return userService.checkLogin(token);
    }

    @PostMapping(value = "/sendUserInfo")
    public Result sendUserInfo(
        @RequestParam(defaultValue = "") String token,
        @RequestParam("rawData") String rawData,
        @RequestParam("signature") String signature,
        @RequestParam("iv") String iv,
        @RequestParam("encryptedData") String encryptedData
    ){
        return userService.getUserInfo(token, rawData, signature, iv, encryptedData);
    }
}
