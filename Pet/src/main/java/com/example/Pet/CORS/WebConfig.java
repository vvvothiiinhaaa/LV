package com.example.Pet.CORS;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import com.example.Pet.AccountStatusInterceptor;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**") // Cho phép tất cả các đường dẫn
                .allowedOrigins("http://127.0.0.1:8080")
                .allowedOrigins("http://127.0.0.1:5501")
                // .allowedOrigins("http://127.0.0.1:5501") // Chỉ định nguồn (origin) được phép truy cập
                .allowedMethods("GET", "POST", "PUT", "DELETE") // Các phương thức được phép
                .allowedHeaders("*") // Các header được phép
                .allowCredentials(true); // Cho phép gửi cookie
    }

    @Autowired
    private AccountStatusInterceptor accountStatusInterceptor;

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(accountStatusInterceptor)
                .addPathPatterns("/api/**") // Áp dụng cho mọi API bắt đầu bằng /api
                .excludePathPatterns("/api/auth/**"); // Loại trừ các API login/logout
    }

}
