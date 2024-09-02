package com.app.dto;

import lombok.*;

@Setter
@Getter
@ToString
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ChannelDto {

    private int channelNo;
    private String channelNm;
    private String prefixe;
    private String topic;
}
