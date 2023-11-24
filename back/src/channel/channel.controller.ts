import { Controller, Get, Post, Put, Param, Delete } from '@nestjs/common';
import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException, UseGuards} from '@nestjs/common';
import { ChannelService } from './channel.service';
import { Channel } from './interfaces/channel.interface';
import { IsMemberOf } from './interfaces/isMemberOf.interface';
import { ChannelMessage } from './interfaces/channelMessage.interface';
import { User } from 'src/users/users.decorator';
import { AuthService } from 'src/auth/auth.service';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { parseBooleanPipe, numberValidityPipe, stringExistNotNullPipe, stringExistNotNullNotTooLongPipe} from 'src/injectable';

@Controller('channel')
export class ChannelController {
  
  constructor(private channelService: ChannelService, private authService: AuthService) {}

  // get all channels (to search for joining a channel)
  @Get('/publicChannels')
  async findAllChannels(): Promise<Channel[]>
  {
    return this.channelService.findAllPublicChannels();
  }

  @UseGuards(JwtAuthGuard)
  @Get('/myChannel/:userId(\\d+)')
  async findMyChannels(
    @Param('userId', numberValidityPipe) userId: number,
    @User() CallerId: number
  ): Promise<Channel[]>
  {
    if (await this.authService.verifysame({id: userId}, CallerId) == false)
    {
      return({message: "Intruder !!!"} as any)
    }
    return this.channelService.findMyChannels(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/myChannelWithPrivileges/:channelId(\\d+)/:userId(\\d+)')
  async findMyChannelWithPrivileges(
    @Param('channelId', numberValidityPipe)channelId: number,
    @Param('userId', numberValidityPipe)userId: number,
    @User() CallerId: number
  ): Promise<Channel[]>
  {
    if (await this.authService.verifysame({id: userId}, CallerId) == false)
      return({message: "Intruder !!!"} as any)
    return this.channelService.findMyChannelWithPrivileges(channelId, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/specificChannel/:channelId(\\d+)/:userId(\\d+)')
  async findSpecificChannels(
    @Param('channelId', numberValidityPipe) channelId: number,
    @Param('userId', numberValidityPipe) userId: number,
    @User() CallerId: number
  ): Promise<Channel | undefined>
  {
    if (await this.authService.verifysame({id: userId}, CallerId) == false)
    {
      return({message: "Intruder !!!"} as any)
    }
    return this.channelService.findSpecificChannels(channelId, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/createChannel/:userId(\\d+)/:channelName/:channelPrivacy/:channelPass')
  async createChannelWithPass(
    @Param('userId', numberValidityPipe)userId: number,
    @Param('channelName', stringExistNotNullNotTooLongPipe)channelName: string,
    @Param('channelPrivacy', parseBooleanPipe)channelPrivacy: boolean,
    @Param('channelPass', stringExistNotNullNotTooLongPipe)channelPass: string,
    @User() CallerId: number
  ): Promise<Channel>
  {
    if (await this.authService.verifysame({id: userId}, CallerId) == false)
      return({message: "Intruder !!!"} as any)
    return this.channelService.createChannel(userId, channelName, channelPrivacy, channelPass);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/createChannel/:userId(\\d+)/:channelName/:channelPrivacy')
  async createChannelWihoutPass(
    @Param('userId', numberValidityPipe)userId: number,
    @Param('channelName', stringExistNotNullNotTooLongPipe)channelName: string,
    @Param('channelPrivacy', parseBooleanPipe)channelPrivacy: boolean,
    @User() CallerId: number
  ): Promise<Channel>
  {
    if (await this.authService.verifysame({id: userId}, CallerId) == false)
      return({message: "Intruder !!!"} as any)
    return this.channelService.createChannel(userId, channelName, channelPrivacy, "");
  }

  @UseGuards(JwtAuthGuard)
  @Put('/updateChannelName/:channelId(\\d+)/:userId(\\d+)/:newName')
  async updateChannelName(
    @Param('channelId', numberValidityPipe)channelId: number,
    @Param('userId', numberValidityPipe)userId: number,
    @Param('newName', stringExistNotNullNotTooLongPipe)newName: string,
    @User() CallerId: number
  ): Promise<boolean>
  {
    if (await this.authService.verifysame({id: userId}, CallerId) == false)
      return({message: "Intruder !!!"} as any)
    return this.channelService.updateChannelName(channelId, userId, newName);
  }

  @UseGuards(JwtAuthGuard)
  @Put('/updateChannelImage/:channelId(\\d+)/:userId(\\d+)/:newPathImage')
  async updateChannelImage(
    @Param('channelId', numberValidityPipe)channelId: number,
    @Param('userId', numberValidityPipe)userId: number,
    @Param('newPathImage', stringExistNotNullNotTooLongPipe)newPathImage: string,
    @User() CallerId: number
  ): Promise<boolean>
  {
    if (await this.authService.verifysame({id: userId}, CallerId) == false)
      return({message: "Intruder !!!"} as any)
    return this.channelService.updateChannelImage(channelId, userId, newPathImage);
  }

  @UseGuards(JwtAuthGuard)
  @Put('/updateChannelPrivacy/:channelId(\\d+)/:userId(\\d+)/:newPrivacy')
  async updateChannelPrivacy(
    @Param('channelId', numberValidityPipe)channelId: number,
    @Param('userId', numberValidityPipe)userId: number,
    @Param('newPrivacy', parseBooleanPipe)newPrivacy: boolean,
    @User() CallerId: number
  ): Promise<boolean>
  {
    if (await this.authService.verifysame({id: userId}, CallerId) == false)
      return({message: "Intruder !!!"} as any)
    return this.channelService.updateChannelPrivacy(channelId, userId, newPrivacy);
  }

  @UseGuards(JwtAuthGuard)
  @Put('/updateChannelPassword/:channelId(\\d+)/:userId(\\d+)/:newPassword')
  async updateChannelPassword(
    @Param('channelId', numberValidityPipe)channelId: number,
    @Param('userId', numberValidityPipe)userId: number,
    @Param('newPassword', parseBooleanPipe)newPassword: string,
    @User() CallerId: number
  ): Promise<boolean>
  {
    if (await this.authService.verifysame({id: userId}, CallerId) == false)
      return({message: "Intruder !!!"} as any)
    return this.channelService.updateChannelPassword(channelId, userId, newPassword);
  }

  @UseGuards(JwtAuthGuard)
  @Put('/updateChannelPassword/:channelId(\\d+)/:userId(\\d+)')
  async updateChannelNoPassword(
    @Param('channelId', numberValidityPipe)channelId: number,
    @Param('userId', numberValidityPipe)userId: number,
    @User() CallerId: number
  ): Promise<boolean>
  {
    if (await this.authService.verifysame({id: userId}, CallerId) == false)
      return({message: "Intruder !!!"} as any)
    return this.channelService.updateChannelPassword(channelId, userId, "");
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/deleteChannel/:channelId(\\d+)/:userId(\\d+)')
  async deleteChannel(
    @Param('channelId', numberValidityPipe)channelId: number,
    @Param('userId', numberValidityPipe)userId: number,
    @User() CallerId: number
  ): Promise<boolean>
  {
    if (await this.authService.verifysame({id: userId}, CallerId) == false)
      return({message: "Intruder !!!"} as any)
    return this.channelService.deleteChannel(channelId, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/getUsersOfChannel/:channelId(\\d+)/:userId(\\d+)')
  async getUsersOfChannel(
    @Param('channelId', numberValidityPipe)channelId: number,
    @Param('userId', numberValidityPipe)userId: number,
    @User() CallerId: number
  ): Promise<IsMemberOf[]>
  {
    if (await this.authService.verifysame({id: userId}, CallerId) == false)
      return({message: "Intruder !!!"} as any)
    return this.channelService.getUsersOfChannel(channelId, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/joinChannel/:channelId(\\d+)/:userId(\\d+)')
  async joinChannel(
    @Param('channelId', numberValidityPipe)channelId: number,
    @Param('userId', numberValidityPipe)userId: number,
    @User() CallerId: number
  ): Promise<boolean>
  {
    if (await this.authService.verifysame({id: userId}, CallerId) == false)
      return({message: "Intruder !!!"} as any)
    return this.channelService.joinChannel(channelId, userId, "");
  }

  @UseGuards(JwtAuthGuard)
  @Post('/joinChannel/:channelId(\\d+)/:userId(\\d+)/:password')
  async joinChannelWithPassword(
    @Param('channelId', numberValidityPipe)channelId: number,
    @Param('userId', numberValidityPipe)userId: number,
    @Param('password', stringExistNotNullNotTooLongPipe)password: string,
    @User() CallerId: number
  ): Promise<boolean>
  {
    if (await this.authService.verifysame({id: userId}, CallerId) == false)
      return({message: "Intruder !!!"} as any)
    return this.channelService.joinChannel(channelId, userId, password);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/inviteChannel/:channelId(\\d+)/:userId(\\d+)/:userIdInvited(\\d+)')
  async inviteChannel(
    @Param('channelId', numberValidityPipe)channelId: number,
    @Param('userId', numberValidityPipe)userId: number,
    @Param('userIdInvited', numberValidityPipe)userIdInvited: number,
    @User() CallerId: number
  ): Promise<boolean>
  {
    if (await this.authService.verifysame({id: userId}, CallerId) == false)
      return({message: "Intruder !!!"} as any)
    return this.channelService.inviteChannel(channelId, userId, userIdInvited);
  }

  @UseGuards(JwtAuthGuard)
  @Put('/banFromChannel/:channelId(\\d+)/:userId(\\d+)/:userIdToBan(\\d+)')
  async banFromChannel(
    @Param('channelId', numberValidityPipe)channelId: number,
    @Param('userId', numberValidityPipe)userId: number,
    @Param('userIdToBan', numberValidityPipe)userIdToBan: number,
    @User() CallerId: number
  ): Promise<boolean>
  {
    if (await this.authService.verifysame({id: userId}, CallerId) == false)
      return({message: "Intruder !!!"} as any)
    return this.channelService.banFromChannel(channelId, userId, userIdToBan);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/unBanFromChannel/:channelId(\\d+)/:userId(\\d+)/:userIdToUnBan(\\d+)')
  async unBanFromChannel(
    @Param('channelId', numberValidityPipe)channelId: number,
    @Param('userId', numberValidityPipe)userId: number,
    @Param('userIdToUnBan', numberValidityPipe)userIdToUnBan: number,
    @User() CallerId: number
  ): Promise<boolean>
  {
    if (await this.authService.verifysame({id: userId}, CallerId) == false)
      return({message: "Intruder !!!"} as any)
    return this.channelService.unBanFromChannel(channelId, userId, userIdToUnBan);
  }

  @UseGuards(JwtAuthGuard)
  @Put('/muteFromChannel/:channelId(\\d+)/:userId(\\d+)/:userIdToMute(\\d+)')
  async muteFromChannel(
    @Param('channelId', numberValidityPipe)channelId: number,
    @Param('userId', numberValidityPipe)userId: number,
    @Param('userIdToMute', numberValidityPipe)userIdToMute: number,
    @User() CallerId: number
  ): Promise<boolean>
  {
    if (await this.authService.verifysame({id: userId}, CallerId) == false)
      return({message: "Intruder !!!"} as any)
    return this.channelService.muteFromChannel(channelId, userId, userIdToMute);
  }

  @UseGuards(JwtAuthGuard)
  @Put('/unmuteFromChannel/:channelId(\\d+)/:userId(\\d+)/:userIdToUnMute(\\d+)')
  async unmuteFromChannel(
    @Param('channelId', numberValidityPipe)channelId: number,
    @Param('userId', numberValidityPipe)userId: number,
    @Param('userIdToUnMute', numberValidityPipe)userIdToUnMute: number,
    @User() CallerId: number
  ): Promise<boolean>
  {
    if (await this.authService.verifysame({id: userId}, CallerId) == false)
      return({message: "Intruder !!!"} as any)
    return this.channelService.unmuteFromChannel(channelId, userId, userIdToUnMute);
  }

  @UseGuards(JwtAuthGuard)
  @Put('/promoteFromChannel/:channelId(\\d+)/:userId(\\d+)/:userIdToPromote(\\d+)')
  async promoteFromChannel(
    @Param('channelId', numberValidityPipe)channelId: number,
    @Param('userId', numberValidityPipe)userId: number,
    @Param('userIdToPromote', numberValidityPipe)userIdToPromote: number,
    @User() CallerId: number
  ): Promise<boolean>
  {
    if (await this.authService.verifysame({id: userId}, CallerId) == false)
      return({message: "Intruder !!!"} as any)
    return this.channelService.promoteFromChannel(channelId, userId, userIdToPromote);
  }

  @UseGuards(JwtAuthGuard)
  @Put('/demoteFromChannel/:channelId(\\d+)/:userId(\\d+)/:userIdToDemote(\\d+)')
  async demoteFromChannel(
    @Param('channelId', numberValidityPipe)channelId: number,
    @Param('userId', numberValidityPipe)userId: number,
    @Param('userIdToDemote', numberValidityPipe)userIdToDemote: number,
    @User() CallerId: number
  ): Promise<boolean>
  {
    if (await this.authService.verifysame({id: userId}, CallerId) == false)
      return({message: "Intruder !!!"} as any)
    return this.channelService.demoteFromChannel(channelId, userId, userIdToDemote);
  }

  @UseGuards(JwtAuthGuard)
  @Put('/giveOwnershipChannelTo/:channelId(\\d+)/:userId(\\d+)/:userIdToGiveOwnership(\\d+)')
  async giveOwnershipChannelTo(
    @Param('channelId', numberValidityPipe)channelId: number,
    @Param('userId', numberValidityPipe)userId: number,
    @Param('userIdToGiveOwnership', numberValidityPipe)userIdToGiveOwnership: number,
    @User() CallerId: number
  ): Promise<boolean>
  {
    if (await this.authService.verifysame({id: userId}, CallerId) == false)
      return({message: "Intruder !!!"} as any)
    return this.channelService.giveOwnershipChannelTo(channelId, userId, userIdToGiveOwnership);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/KickFromChannel/:channelId(\\d+)/:userId(\\d+)/:userIdToKick(\\d+)')
  async KickFromChannel(
    @Param('channelId', numberValidityPipe)channelId: number,
    @Param('userId', numberValidityPipe)userId: number,
    @Param('userIdToKick', numberValidityPipe)userIdToKick: number,
    @User() CallerId: number
  ): Promise<boolean>
  {
    if (await this.authService.verifysame({id: userId}, CallerId) == false)
      return({message: "Intruder !!!"} as any)
    return this.channelService.KickFromChannel(channelId, userId, userIdToKick);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/leaveChannel/:channelId(\\d+)/:userId(\\d+)')
  async leaveChannel(
    @Param('channelId', numberValidityPipe)channelId: number,
    @Param('userId', numberValidityPipe)userId: number,
    @User() CallerId: number
  ): Promise<boolean>
  {
    if (await this.authService.verifysame({id: userId}, CallerId) == false)
      return({message: "Intruder !!!"} as any)
    return this.channelService.leaveChannel(channelId, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/getAllMessageFromChannel/:channelId(\\d+)/:userId(\\d+)')
  async getAllMessageFromChannel(
    @Param('channelId', numberValidityPipe) channelId: number,
    @Param('userId', numberValidityPipe) userId: number,
    @User() CallerId: number
  ): Promise<ChannelMessage[]>
  {
    if (await this.authService.verifysame({id: userId}, CallerId) == false)
      return({message: "Intruder !!!"} as any)
    return this.channelService.getAllMessageFromChannel(channelId, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/newMessageToChannel/:channelId(\\d+)/:userId(\\d+)/:content')
  async newMessageToChannel(
    @Param('channelId', numberValidityPipe)channelId: number,
    @Param('userId', numberValidityPipe)userId: number,
    @Param('content', stringExistNotNullPipe)content: string,
    @User() CallerId: number
  ): Promise<boolean>
  {
    if (await this.authService.verifysame({id: userId}, CallerId) == false)
      return({message: "Intruder !!!"} as any)
    return this.channelService.newMessageToChannel(channelId, userId, content);
  }

  @UseGuards(JwtAuthGuard)
  @Put('/updateMessageToChannel/:channelId(\\d+)/:userId(\\d+)/:dateMessageToUpdate/:content')
  async updateMessageToChannel(
    @Param('channelId', numberValidityPipe)channelId: number,
    @Param('userId', numberValidityPipe)userId: number,
    @Param('dateMessageToUpdate', stringExistNotNullNotTooLongPipe)dateMessageToUpdate: string,
    @Param('content', stringExistNotNullPipe)content: string,
    @User() CallerId: number
  ): Promise<boolean>
  {
    if (await this.authService.verifysame({id: userId}, CallerId) == false)
      return({message: "Intruder !!!"} as any)
    return this.channelService.updateMessageToChannel(channelId, userId, dateMessageToUpdate, content);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/deleteMessageFromChannel/:channelId(\\d+)/:userId(\\d+)/:userIdMessage(\\d+)/:dateMessageToDelete')
  async deleteMessageFromChannel(
    @Param('channelId', numberValidityPipe)channelId: number,
    @Param('userId', numberValidityPipe)userId: number,
    @Param('userIdMessage', numberValidityPipe)userIdMessage: number,
    @Param('dateMessageToDelete', stringExistNotNullNotTooLongPipe)dateMessageToDelete: string,
    @User() CallerId: number
  ): Promise<boolean>
  {
    if (await this.authService.verifysame({id: userId}, CallerId) == false)
      return({message: "Intruder !!!"} as any)
    return this.channelService.deleteMessageFromChannel(channelId, userId, userIdMessage, dateMessageToDelete);
  }
}