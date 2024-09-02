package com.app.dto;

import lombok.*;

@Setter
@Getter
@ToString
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserDto {

    private int userNo;
    private String userNm;
    private String userPwd;
    private boolean userEnable;
}
