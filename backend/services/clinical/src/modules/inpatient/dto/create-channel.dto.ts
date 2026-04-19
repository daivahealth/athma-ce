import { IsUUID, IsOptional, IsString } from 'class-validator';

export class CreateChannelDto {
  @IsUUID("all")
  admissionId!: string;

  @IsOptional()
  @IsString()
  channelName?: string;
}
