package com.xiaping.infshare.exception;

import com.xiaping.infshare.enums.ResultEnum;

public class WxException extends RuntimeException {
    private ResultEnum resultEnum;

    public WxException(ResultEnum resultEnum) {
        super(resultEnum.getMsg());
        this.resultEnum = resultEnum;
    }

    public ResultEnum getResultEnum() {
        return resultEnum;
    }

    public void setResultEnum(ResultEnum resultEnum) {
        this.resultEnum = resultEnum;
    }
}
