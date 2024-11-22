import ApiResponse from '@/interfaces/api-service.interface';
import { ClientUser, InternalRole, InternalRoleEnum, Permissions } from '@/interfaces/users.interface';
import { Type } from 'class-transformer';
import { IsEnum, IsString, ValidateNested } from 'class-validator';

// export class Permissions implements IPermissions {
//   @IsBoolean()
//   canEditSystemMessages: boolean;
// }

export class User implements ClientUser {
  @IsString()
  name: string;
  @IsString()
  firstName: string;
  @IsString()
  lastName: string;
  @IsString()
  username: string;
  @IsEnum(InternalRoleEnum)
  role: InternalRole;
  @ValidateNested()
  @Type(() => Permissions)
  permissions: Permissions;
}

export class UserApiResponse implements ApiResponse<User> {
  @ValidateNested()
  @Type(() => User)
  data: User;
  @IsString()
  message: string;
}
