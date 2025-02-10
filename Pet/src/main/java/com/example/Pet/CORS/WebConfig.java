package com.example.Pet.CORS;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**") // Cho phép tất cả các đường dẫn
                .allowedOrigins("http://127.0.0.1:8080")
                // .allowedOrigins("http://127.0.0.1:5501") // Chỉ định nguồn (origin) được phép truy cập
                .allowedMethods("GET", "POST", "PUT", "DELETE") // Các phương thức được phép
                .allowedHeaders("*") // Các header được phép
                .allowCredentials(true); // Cho phép gửi cookie
    }

}
