package com.xiaping.infshare;

import com.xiaping.infshare.utils.RedisOperator;
import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.Set;

@RunWith(SpringRunner.class)
@SpringBootTest
public class InfshareApplicationTests {

    @Autowired
    private RedisOperator redisOperator;

    @Autowired
    private StringRedisTemplate stringRedisTemplate;

    @Test
    public void test() throws Exception {

        // 保存字符串
        stringRedisTemplate.opsForValue().set("aaa", "111");
        Assert.assertEquals("111", stringRedisTemplate.opsForValue().get("aaa"));
    }

    @Test
    public void testRedis(){
        redisOperator.set("e", 2);
        redisOperator.incr("e", 1);

        long ttl = redisOperator.ttl("e");

        redisOperator.incr("gdl",1);
        Set<String> set = redisOperator.keys("gdl");

        Assert.assertEquals("1","1");
    }
}

