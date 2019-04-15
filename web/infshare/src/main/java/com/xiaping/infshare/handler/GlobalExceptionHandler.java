package com.xiaping.infshare.handler;

import com.xiaping.infshare.dto.Result;
import com.xiaping.infshare.enums.ResultEnum;
import com.xiaping.infshare.exception.WxException;
import com.xiaping.infshare.utils.ResultUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;

/**
 * 统一异常处理类
 */
@ControllerAdvice
public class GlobalExceptionHandler {

    private final static Logger logger = LoggerFactory.getLogger(GlobalExceptionHandler.class);


    @ExceptionHandler(value = Exception.class)
    @ResponseBody
    public Result exceptionHandler(Exception e){
        if (e instanceof WxException) {
            logger.error("【逻辑异常】{}", e.getMessage());
            WxException wxException = (WxException) e;
            return ResultUtil.getResult(wxException.getResultEnum());
        }else {
            logger.error("【系统异常】{}", e.getMessage());
            return ResultUtil.getResult(ResultEnum.UNKONW_ERROR);
        }
    }

}