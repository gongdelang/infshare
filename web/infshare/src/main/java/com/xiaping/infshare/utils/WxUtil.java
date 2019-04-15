package com.xiaping.infshare.utils;

import com.xiaping.infshare.dto.Jscode2session;
import org.springframework.beans.factory.annotation.Value;

public class WxUtil {

    private static final String APPID = "wxfd77a94f551af8ef";
    private static final String SECRET = "48219ebfe8a2608f0c903cbcc3e913e3";

    private static final String requestUrl = "https://api.weixin.qq.com/sns/jscode2session?appid=APPID&secret=SECRET&js_code=JSCODE&grant_type=authorization_code";

    public static Jscode2session getJscode2session(String code){

        //请求url
        String url = requestUrl.replace("APPID", APPID).replace("SECRET", SECRET).replace("JSCODE", code);

        //获取openid sessionKey unionid
        Jscode2session jscode2session = JsonUtil.jsonToPojo(HttpClientUtil.doGet(url), Jscode2session.class);

        return jscode2session;
    }
}
