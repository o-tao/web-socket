package com.app.controller;

import com.app.dto.ChannelDto;
import com.app.mapper.ChannelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class ApiController {

	@Autowired
	private SimpMessagingTemplate simpMessagingTemplate;

	@Autowired
	private ChannelMapper channelMapper;

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

	@PostMapping("/getChannel")
	public List<ChannelDto> getChannel() {
		return channelMapper.getChannel();
	}
}
