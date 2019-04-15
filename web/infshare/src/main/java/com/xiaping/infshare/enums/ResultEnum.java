package com.xiaping.infshare.enums;


public enum ResultEnum {
    UNKONW_ERROR(-1, "未知错误"),
    SUCCESS(0, "成功"),

    //user错误
    USER_ERRORCODE(10001, "错误code"),
    USER_ERRORINFO(10002, "错误用户信息,解密失败"),
    USER_ERRORTOKEN(10003, "错误token"),
    USER_NOSESSION(10004, "token已过期"),
    USER_TOKENNEEDINFO(10005, "token需要用户信息");


    private Integer code;

    private String msg;

    ResultEnum(Integer code, String msg) {
        this.code = code;
        this.msg = msg;
    }

    public Integer getCode() {
        return code;
    }

    public String getMsg() {
        return msg;
    }
}