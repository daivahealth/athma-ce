import { IsUUID, IsOptional, IsString } from 'class-validator';

export class CreateChannelDto {
  @IsUUID()
  admissionId!: string;

  @IsOptional()
  @IsString()
  channelName?: string;
}
