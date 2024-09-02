package com.app.dto;

import lombok.*;

@Setter
@Getter
@ToString
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class MessageDto {

    private String topic;
    private String message;
    private String time;
}
