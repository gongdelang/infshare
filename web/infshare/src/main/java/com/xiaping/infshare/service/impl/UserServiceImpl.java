package com.xiaping.infshare.service.impl;

import com.xiaping.infshare.dao.UserMapper;
import com.xiaping.infshare.dto.Jscode2session;
import com.xiaping.infshare.dto.Result;
import com.xiaping.infshare.entity.User;
import com.xiaping.infshare.enums.ResultEnum;
import com.xiaping.infshare.exception.WxException;
import com.xiaping.infshare.service.UserService;
import com.xiaping.infshare.utils.AESUtil;
import com.xiaping.infshare.utils.RedisOperator;
import com.xiaping.infshare.utils.ResultUtil;
import com.xiaping.infshare.utils.WxUtil;
import net.sf.json.JSONObject;
import org.apache.commons.codec.binary.Base64;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.security.InvalidAlgorithmParameterException;
import java.util.Date;
import java.util.HashMap;
import java.util.UUID;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserMapper userDao;

    @Autowired
    private RedisOperator redisOperator;

    @Value("${token.ttl}")
    private long tokenTTL;

    /**
     * 微信小程序登录
     * @param code
     * @return
     * @throws IOException
     */
    @Transactional
    @Override
    public Result<HashMap<String, String>> login(String code){
        /*
         * 1.拿到code
         * appid + appsecret + code
         * 拿到session_key + openid
         */
        Jscode2session jscode2session = WxUtil.getJscode2session(code);
        if(jscode2session == null){
            throw new WxException(ResultEnum.USER_ERRORCODE);
        }

        String sessionkey = jscode2session.getSession_key();
        String openid = jscode2session.getOpenid();

        if(sessionkey == null || openid == null || "".equals(sessionkey) || "".equals(openid)){
            throw new WxException(ResultEnum.USER_ERRORCODE);
        }

        /*
         * 2.生产唯一标识token
         */
        String token = UUID.randomUUID().toString();
        HashMap<String, String> data = new HashMap<>();
        data.put("token", token);

        /*
         * 3.根据openid去数据库查询用户数据
         */
        User user = userDao.selectByOpenid(openid);
        ResultEnum res;
        if(user == null){
            res = ResultEnum.USER_TOKENNEEDINFO;
        }else{
            res = ResultEnum.SUCCESS;
        }

        //5.将jscode2session信息放入redis缓存
        redisOperator.set(token, jscode2session, tokenTTL);

        return ResultUtil.getResult(res, data);
    }

    @Override
    public Result<Object> checkLogin(String token){
        /*
         * 使用token从reids获取sessionKey
         */
        Jscode2session jscode2session = redisOperator.get(token, Jscode2session.class);
        if(jscode2session == null){
            return ResultUtil.getResult(ResultEnum.USER_NOSESSION);
        }

        /*
         * 3.根据openid去数据库查询用户数据
         */
        User user = userDao.selectByOpenid(jscode2session.getOpenid());
        ResultEnum res;
        if(user == null){
            res = ResultEnum.USER_TOKENNEEDINFO;
        }else{
            res = ResultEnum.SUCCESS;
        }

        return ResultUtil.getResult(res);
    }


    @Override
    public Result<HashMap<String, String>> getUserInfo(String token, String rawData, String signature, String iv, String encryptedData){

        String userInfo;

        /*
         * 使用token从reids获取sessionKey
         */
        Jscode2session jscode2session = redisOperator.get(token, Jscode2session.class);
        if(jscode2session == null){
            return ResultUtil.getResult(ResultEnum.USER_NOSESSION);
        }


        /*
         * 解密，获取用户信息
         */
        try {
            //解密
            byte[] resultByte = AESUtil.decrypt(Base64.decodeBase64(encryptedData), Base64.decodeBase64(jscode2session.getSession_key()), Base64.decodeBase64(iv));
            if(resultByte == null || resultByte.length <= 0){
                return ResultUtil.getResult(ResultEnum.USER_ERRORINFO);
            }

            //获取用户信息
            userInfo = new String(resultByte, "UTF-8");
            if(userInfo == null){
                return ResultUtil.getResult(ResultEnum.USER_ERRORINFO);
            }

        } catch (InvalidAlgorithmParameterException e) {
            throw new RuntimeException(e.getMessage());
        } catch (UnsupportedEncodingException e){
            throw new RuntimeException(e.getMessage());
        }

        /*
         * 插入数据库或者更新数据（用户信息）
         */
        //获取用户信息到对象
        User newUser = new User();
        JSONObject userInfoJson = JSONObject.fromObject(userInfo);
        if(userInfoJson.has("city")){
            newUser.setCity(userInfoJson.getString("city"));
        }
        if(userInfoJson.has("avatarUrl")){
            newUser.setAvatarUrl(userInfoJson.getString("avatarUrl"));
        }
        if(userInfoJson.has("country")){
            newUser.setCountry(userInfoJson.getString("country"));
        }
        if(userInfoJson.has("nickName")){
            newUser.setNickName(userInfoJson.getString("nickName"));
        }
        if(userInfoJson.has("gender")){
            newUser.setGender(userInfoJson.getString("gender"));
        }
        if(userInfoJson.has("province")){
            newUser.setProvince(userInfoJson.getString("province"));
        }
        if(userInfoJson.has("openId")){
            newUser.setOpenid(userInfoJson.getString("openId"));
        }
        if(userInfoJson.has("unionId")){
            newUser.setUnionid(userInfoJson.getString("unionId"));
        }
        newUser.setCreateStamp(new Date().getTime());

        //数据库查找用户
        User user = userDao.selectByOpenid(jscode2session.getOpenid());

        //选择插入还是更新数据
        if (user == null) {
            userDao.insert(newUser);
        }else{
            newUser.setId(user.getId());
            userDao.updateByPrimaryKey(newUser);
        }

        //6.返回rawData做数据验证
        HashMap<String, String> data = new HashMap<>();

        return ResultUtil.getResult(ResultEnum.SUCCESS, data);
    }
}