package com.app.dto;

import lombok.*;

@Setter
@Getter
@ToString
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PayloadMessageDto { // 프론트에서 받는 값

    private MessageDto message;
    private UserDto user;
}
