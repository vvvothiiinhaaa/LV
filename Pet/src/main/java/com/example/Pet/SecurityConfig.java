// package com.example.Pet;

// import org.springframework.context.annotation.Bean;
// import org.springframework.context.annotation.Configuration;
// import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
// import org.springframework.security.crypto.password.PasswordEncoder;

// @Configuration
// public class SecurityConfig {

//     @Bean
//     public PasswordEncoder passwordEncoder() {
//         return new BCryptPasswordEncoder();  // Cung cấp PasswordEncoder để mã hóa mật khẩu
//     }
// // 
//     // @Bean
//     // public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
//     //     http
//     //             .csrf().disable() // Tắt CSRF nếu không cần bảo vệ
//     //             .authorizeRequests()
//     //             .regexMatchers("/api/auth/register").permitAll() // Cho phép đăng ký mà không cần đăng nhập
//     //             .anyRequest().authenticated() // Các yêu cầu khác yêu cầu đăng nhập
//     //             .and()
//     //             .formLogin().disable() // Tắt form login mặc định nếu bạn không cần
//     //             .logout().disable();    // Tắt logout mặc định nếu bạn không cần
//     //     return http.build();
//     // }
// }
