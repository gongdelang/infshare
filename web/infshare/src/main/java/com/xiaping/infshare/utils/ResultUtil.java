package com.xiaping.infshare.utils;

import com.xiaping.infshare.dto.Result;
import com.xiaping.infshare.enums.ResultEnum;

public class ResultUtil {
    public static <E> Result<E> getResult(ResultEnum resultEnum, E object) {
        Result<E> result = new Result();
        result.setCode(resultEnum.getCode());
        result.setMsg(resultEnum.getMsg());
        result.setData(object);
        return result;
    }

    public static Result getResult(ResultEnum resultEnum) {
        return getResult(resultEnum,null);
    }
}
