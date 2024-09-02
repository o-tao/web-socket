package com.app.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    // 요청
    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        // JS에서 웹소켓 접속 시 해당 URL로 연결
        registry.addEndpoint("/ws-app")
                .setAllowedOrigins("http://127.0.0.1:5500", "http://localhost:5500", "http://192.168.0.9:5500") // 프론트 주소 (프론트가 요청하는 대상)
                .withSockJS();
    }

    // 응답
    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        // 사용자가 서버에게 메세지를 전송할때
        registry.setApplicationDestinationPrefixes("/msg"); // 백엔드에서 메서드 호출하기 위한 주소
        registry.enableSimpleBroker("/topic"); // 프론트엔드 함수에서 데이터를 돌려주기 위한 주소
    }

}
