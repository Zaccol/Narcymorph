import { ApiProperty } from '@nestjs/swagger';

class UserDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  username: string;
}

export class LoginResponseDto {
  @ApiProperty({ type: UserDto })
  user: UserDto;

  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  refreshToken: string;
}
