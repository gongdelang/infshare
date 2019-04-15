package com.xiaping.infshare.aspect;

import com.xiaping.infshare.dto.Jscode2session;
import com.xiaping.infshare.enums.ResultEnum;
import com.xiaping.infshare.exception.WxException;
import com.xiaping.infshare.utils.RedisOperator;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.Cookie;

@Aspect
@Component
public class HttpAspect {

    @Autowired
    private RedisOperator redisOperator;

    //日志对象（用于打印日志）
    private final static Logger logger = LoggerFactory.getLogger(HttpAspect.class);


    /*
     * 请求日AOP - start
     */
    @Pointcut("execution(public * com.xiaping.infshare.web.*.*(..))")
    public void log() {
    }

    @Before("log()")
    public void doBeforeHttp(JoinPoint joinPoint) {
        logger.info("请求执行开始");
        ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        HttpServletRequest request = attributes.getRequest();

        //url
        logger.info("url={}", request.getRequestURL());

        //method
        logger.info("method={}", request.getMethod());

        //ip
        logger.info("ip={}", request.getRemoteAddr());

        //类方法
        logger.info("class_method={}", joinPoint.getSignature().getDeclaringTypeName() + "." + joinPoint.getSignature().getName());

        //参数
        logger.info("args={}", joinPoint.getArgs());
    }

    @After("log()")
    public void doAfterHttp() {
        logger.info("请求执行完毕");
    }
    /*
     * 请求日志AOP - end
     */


    /*
     * 登陆AOP（获取cookie中的token）- start
     */
    @Pointcut("execution(public * com.xiaping.infshare.web.UserController.*(..)) && !execution(public * com.xiaping.infshare.web.UserController.login(..))")
    public void checkLogin() {
    }

    //对使用到token的函数检查
    @Around("checkLogin()")
    public Object doBeforeLogin(ProceedingJoinPoint joinPoint) throws Throwable{
        logger.info("登陆校验执行开始");

        ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        HttpServletRequest request = attributes.getRequest();

        //获取cookie中的token
        String token = "";
        Cookie[] cookies =  request.getCookies();
        if(cookies != null){
            for(Cookie cookie : cookies){
                if(cookie.getName().equals("token")){
                   token = cookie.getValue();
                }
            }
        }

        //检查登陆
        if("".equals(token)){
            logger.error("token不在cookie中");
            throw new WxException(ResultEnum.USER_ERRORTOKEN);
        }

        //从reids中获取缓存的用户信息
        Jscode2session jscode2session =  redisOperator.get(token, Jscode2session.class);
        if(jscode2session == null){
            logger.error("token不在redis中");
            throw new WxException(ResultEnum.USER_NOSESSION);
        }

        //向使用token的Controler中传递token
        //获取目标方法的参数信息
        Object[] objs = joinPoint.getArgs();

        //第一个参数规定是token（String）
        objs[0] = token;

        return joinPoint.proceed(objs);
    }

    @After("checkLogin()")
    public void doAftereLogin(){
        logger.info("登陆校验执行完毕");
    }

    /*
     * 登陆AOP - end
     */

}