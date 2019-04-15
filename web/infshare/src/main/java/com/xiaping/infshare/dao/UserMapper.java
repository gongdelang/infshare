package com.xiaping.infshare.dao;

import com.xiaping.infshare.entity.User;

public interface UserMapper {
    int deleteByPrimaryKey(Integer id);

    int insert(User record);

    int insertSelective(User record);

    User selectByPrimaryKey(Integer id);

    int updateByPrimaryKeySelective(User record);

    int updateByPrimaryKey(User record);

    /*
     * 自定义sql语句
     */
    //1.根据openid查询用户
    User selectByOpenid(String openid);
}