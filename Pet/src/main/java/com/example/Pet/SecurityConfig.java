// package com.example.Pet;

// import javax.sql.DataSource;

// import org.springframework.context.annotation.ComponentScan;
// import org.springframework.context.annotation.Configuration;
// import org.springframework.security.crypto.password.PasswordEncoder;

// @Configuration
// @ComponentScan(basePackages = "com.example.Pet")
// public class SecurityConfig {

//     private final DataSource dataSource;
//     private final PasswordEncoder passwordEncoder;

//     public SecurityConfig(DataSource dataSource, PasswordEncoder passwordEncoder) {
//         this.dataSource = dataSource;
//         this.passwordEncoder = passwordEncoder;
//     }

//     // // Cấu hình AuthenticationManager
//     // @Bean
//     // public AuthenticationManager authenticationManager(HttpSecurity http) throws Exception {
//     //     AuthenticationManagerBuilder authenticationManagerBuilder
//     //             = http.getSharedObject(AuthenticationManagerBuilder.class);
//     //     authenticationManagerBuilder.jdbcAuthentication()
//     //             .dataSource(dataSource)
//     //             .passwordEncoder(passwordEncoder); // Sử dụng PasswordEncoder từ PasswordConfig
//     //     return authenticationManagerBuilder.build();
//     // }
//     // // Cấu hình bảo mật cho các URL yêu cầu quyền truy cập
//     // // @Bean
//     // @Bean
//     // public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
//     //     http
//     //             .authorizeRequests(authorizeRequests
//     //                     -> authorizeRequests
//     //                     // // Trang admin (Chỉ admin có thể truy cập)
//     //                     // .requestMatchers(" /dashboard-admin.html").hasRole("ADMIN")
//     //                     // // Trang nhân viên (Chỉ nhân viên có thể truy cập)
//     //                     // .requestMatchers("/dashboard-employee.html", "/employee-order-detail.html", "/employee-order.html", "/employee-product.html").hasRole("STAFF")
//     //                     // // Các trang khách hàng (Ai cũng có thể truy cập)
//     //                     // .requestMatchers("/employee-login.html", "/admin-login.html", "/login.html", "/product-detail.html", "/searchproduct.html", "/add-product.html", "/product.html", "/order.html", "/service.html", "/profile.html", "/cart.html", "/detail.html", "/pet.html", "/pay.html", "/addr.html", "/address.html").permitAll()
//     //                     // // Các yêu cầu khác đều yêu cầu đăng nhập
//     //                     // .anyRequest().authenticated()
//     //             )
//     //             // .formLogin(formLogin
//     //             //         -> formLogin
//     //             //         .loginPage("/login.html")
//     //             //         .permitAll()
//     //             // )
//     //             .logout(logout -> logout
//     //             .permitAll()
//     //             );
//     //     return http.build();
//     // }
//     // Cấu hình UserDetailsService để lấy người dùng từ cơ sở dữ liệu
//     // @Bean
//     // public UserDetailsService userDetailsService() {
//     //     JdbcUserDetailsManager manager = new JdbcUserDetailsManager();
//     //     manager.setDataSource(dataSource);
//     //     return manager;
//     // }
//     // @Bean
//     // public CorsConfigurationSource corsConfigurationSource() {
//     //     CorsConfiguration corsConfig = new CorsConfiguration();
//     //     corsConfig.addAllowedOrigin("http://127.0.0.1:8080");
//     //     corsConfig.addAllowedOrigin("http://127.0.0.1:5501"); // Cho phép frontend truy cập
//     //     corsConfig.addAllowedMethod("*"); // Cho phép tất cả các phương thức (GET, POST, PUT, DELETE...)
//     //     corsConfig.addAllowedHeader("*"); // Cho phép tất cả các headers
//     //     UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
//     //     source.registerCorsConfiguration("/**", corsConfig);
//     //     return source;
//     // }
// }
