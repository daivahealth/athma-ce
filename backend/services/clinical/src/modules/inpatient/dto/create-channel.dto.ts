import { IsUUID, IsOptional, IsString } from 'class-validator';

export class CreateChannelDto {
  @IsUUID("loose" as any)
  admissionId!: string;

  @IsOptional()
  @IsString()
  channelName?: string;
}
