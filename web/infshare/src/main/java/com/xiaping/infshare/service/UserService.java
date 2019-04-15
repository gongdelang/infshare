package com.xiaping.infshare.service;

import com.xiaping.infshare.dto.Result;
import com.xiaping.infshare.dto.Token;

import java.io.IOException;
import java.util.HashMap;

public interface UserService {

    Result login(String code);

    Result checkLogin(String Token);

    Result getUserInfo(String token, String rawData, String signature, String iv, String encryptedData);

}