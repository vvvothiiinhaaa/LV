package com.example.Pet;

import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import com.example.Pet.Modal.User;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

@Component
public class AccountStatusInterceptor implements HandlerInterceptor {

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler)
            throws Exception {

        HttpSession session = request.getSession(false);

        if (session != null) {
            User user = (User) session.getAttribute("user");

            if (user != null && Boolean.FALSE.equals(user.getStatus())) {
                System.out.println(" Tài khoản bị khóa -> Tự động đăng xuất: " + user.getUsername());
                session.invalidate();
                response.sendError(HttpServletResponse.SC_FORBIDDEN, "Tài khoản đã bị vô hiệu hóa.");
                return false;
            }
        }

        return true;
    }
}
