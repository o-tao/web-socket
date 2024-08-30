package com.app.controller;

import java.io.*;
import java.util.ArrayList;
import java.util.List;
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

	private static final String MESSAGE_LOG_FILE = "src/text.txt";

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

		String prefixes = paramMap.get("prefixes");
		String userMessage = paramMap.get("message");
		appendMessageToFile(paramMap); // 메세지를 파일에 추가
		simpMessagingTemplate.convertAndSend(prefixes, paramMap);
		sendHistoryToUser(prefixes); // 새로운 클라이언트에게 기록된 메시지 전송
	}
	
	@EventListener
	public void handleSessionConnectEvent(SessionConnectEvent event) {
		System.out.println("Session Connect Event");
	}

	@EventListener
	public void handleSessionDisconnectEvent(SessionDisconnectEvent event) {
		System.out.println("Session Disconnect Event");

	}

	private void appendMessageToFile(Map<String, String> paramMap) {
		try (BufferedWriter bufferedWriter = new BufferedWriter(new OutputStreamWriter(new FileOutputStream(MESSAGE_LOG_FILE, true), "UTF-8"))) {
			// 메시지와 관련된 정보를 파일에 저장
			bufferedWriter.write(String.format("%s;%s;%s;%s%n", paramMap.get("userNm"), paramMap.get("message"), paramMap.get("time"), paramMap.get("prefixes")));
		} catch (IOException e) {
			throw new RuntimeException(e);
		}
	}

	private void sendHistoryToUser(String prefixes) {
		List<Map<String, String>> history = readMessagesFromFile();
		// 클라이언트에게 저장된 메시지 기록 전송
		simpMessagingTemplate.convertAndSend(prefixes + "/history", history);
	}

	private List<Map<String, String>> readMessagesFromFile() {
		List<Map<String, String>> history = new ArrayList<>();
		try (BufferedReader bufferedReader = new BufferedReader(new InputStreamReader(new FileInputStream(MESSAGE_LOG_FILE), "UTF-8"))) {
			String line;
			while ((line = bufferedReader.readLine()) != null) {
				String[] parts = line.split(";");
				if (parts.length == 4) {
					// 파일에서 읽은 메시지를 Map으로 변환
					Map<String, String> message = Map.of(
							"userNm", parts[0],
							"message", parts[1],
							"time", parts[2],
							"prefixes", parts[3]
					);
					history.add(message);
				}
			}
		} catch (IOException e) {
			throw new RuntimeException(e);
		}
		return history;
	}
}
