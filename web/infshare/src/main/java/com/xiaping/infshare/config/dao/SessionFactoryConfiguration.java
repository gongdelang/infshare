package com.xiaping.infshare.config.dao;

import org.mybatis.spring.SqlSessionFactoryBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.support.PathMatchingResourcePatternResolver;

import javax.sql.DataSource;
import java.io.IOException;

@Configuration
public class SessionFactoryConfiguration {
    @Value("${mybatis_config_file}")
    private String mybatisConfigFilePath;
    @Value("${mapper_path}")
    private String mapperPath;
    @Value("${entity_package}")
    private String entityPackage;

    @Autowired
    @Qualifier("dataSource")
    private DataSource dataSource;

    @Bean(name="sqlSessionFactory")
    public SqlSessionFactoryBean createSqlSessionFactoryBean() throws IOException {
        SqlSessionFactoryBean sqlSessionFactory = new SqlSessionFactoryBean();
        //第一步：加载mybatis xml配置
        sqlSessionFactory.setConfigLocation(new ClassPathResource(mybatisConfigFilePath));

        //第二步：加载mybatis 的 mapper（resources下mapper文件夹下的所有资源）
        PathMatchingResourcePatternResolver resolver = new PathMatchingResourcePatternResolver();
        String packageSearchPath = PathMatchingResourcePatternResolver.CLASSPATH_ALL_URL_PREFIX + mapperPath;
        sqlSessionFactory.setMapperLocations(resolver.getResources(packageSearchPath));

        //第三步：加载数据库连接池 dataSource
        sqlSessionFactory.setDataSource(dataSource);

        //第四步：加载对应的实体类（存储数据使用）
        sqlSessionFactory.setTypeAliasesPackage(entityPackage);

        return sqlSessionFactory;
    }

}
