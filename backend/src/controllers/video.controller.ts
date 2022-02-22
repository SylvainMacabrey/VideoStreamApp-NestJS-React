import { Body, Controller, Delete, Get, HttpStatus, Param, Post, UseInterceptors, UploadedFiles, Put, Req, Res, Query } from "@nestjs/common";
import { Video } from "../models/video.schema"
import { VideoService } from "../services/video.service";
import { FileFieldsInterceptor, FilesInterceptor } from "@nestjs/platform-express";

@Controller('/api/v1/video')
export class VideoController {

    constructor(private readonly videoService: VideoService){}

    @Get('/:id')
    async stream(@Param('id') id, @Res() response, @Req() request) {
        return this.videoService.streamVideo(id, response, request);
    }

    @Put('/:id')
    async update(@Res() response, @Param('id') id, @Body() video: Video) {
        const updatedVideo = await this.videoService.update(id, video);
        return response.status(HttpStatus.OK).json(updatedVideo);
    }

    @Delete('/:id')
    async delete(@Res() response, @Param('id') id) {
        await this.videoService.delete(id);
        return response.status(HttpStatus.OK).json({ user: null });
    }

}