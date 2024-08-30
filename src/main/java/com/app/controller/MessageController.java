package com.app.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.socket.messaging.SessionConnectEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

@Controller
public class MessageController {

	@Autowired
	private SimpMessagingTemplate simpMessagingTemplate;

//	@MessageMapping("/conn")
//	@SendTo("/topic/bean")
//	public Map<String, String> conn(Map<String, String> paramMap) {
//		System.out.println("/conn");
//		return paramMap;
//	}

	@MessageMapping("/conn")
	public void conn1(Map<String, String> paramMap) {
		System.out.println("/conn");
		System.out.println(paramMap);
		simpMessagingTemplate.convertAndSend(paramMap.get("prefixes"), paramMap);
	}
	
	@EventListener
	public void handleSessionConnectEvent(SessionConnectEvent event) {
		System.out.println("Session Connect Event");
	}

	@EventListener
	public void handleSessionConnectEvent(SessionDisconnectEvent event) {
		System.out.println("Session Disconnect Event");
	}
}
