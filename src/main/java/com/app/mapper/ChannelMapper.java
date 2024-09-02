package com.app.mapper;

import com.app.dto.ChannelDto;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface ChannelMapper {

    @Select("SELECT * FROM channel")
    public List<ChannelDto> getChannel();
}
