import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../enum/role.enum';

export class CustomerDto {
  @ApiProperty({
    description: 'The unique identifier of the customer',
    example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  })
  id: string;

  @ApiProperty({
    description: 'The first name of the customer',
    example: 'David',
  })
  firstName: string;

  @ApiProperty({
    description: 'The last name of the customer',
    example: 'Andrei',
  })
  lastName: string;

  @ApiProperty({
    description: 'The username of the customer',
    example: 'davidandrei123',
  })
  username: string;

  @ApiProperty({
    description: 'The email address of the customer',
    example: 'david.andrei@mail.com',
  })
  emailAddress: string;

  @ApiProperty({
    description: 'The role of the customer',
    enum: Role,
  })
  role: Role;
}
