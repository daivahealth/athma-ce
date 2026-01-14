import { IsUUID, IsEnum } from 'class-validator';
import { CareTeamRole } from '@zeal/database-clinical';

export class AddMemberDto {
  @IsUUID()
  staffId!: string;

  @IsEnum(CareTeamRole)
  memberRole!: CareTeamRole;
}
