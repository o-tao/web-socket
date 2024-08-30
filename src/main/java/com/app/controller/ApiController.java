package com.app.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ApiController {

	@Autowired
	private SimpMessagingTemplate simpMessagingTemplate;

	@GetMapping("/")
	public String home() {
		return "Web Socket Start!!";
	}

	@GetMapping("/test")
	public boolean test() {
		String message = "확인";
		simpMessagingTemplate.convertAndSend("/topic/bean", message);

		return true;
	}
}
