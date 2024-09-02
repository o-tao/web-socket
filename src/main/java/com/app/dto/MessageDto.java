package com.app.dto;

import lombok.*;

@Setter
@Getter
@ToString
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class MessageDto { // 프론트에서 받는 값

    private String topic; // 돌아오는 주소
    private String message; // 받는 메세지
    private String time; // 시간
}
