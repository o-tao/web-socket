package com.app.dto;

import lombok.*;

@Setter
@Getter
@ToString
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PayloadMessageDto {

    private MessageDto message;
    private UserDto user;
}
