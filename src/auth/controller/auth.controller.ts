import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { RegistrationDto } from '../dto/registration.dto';
import { AuthService } from '../service/auth.service';

import { AuthResponseDto } from '../dto/auth-response.dto';
import { AuthMapper } from '../mapper/auth.mapper';
import { RefreshedTokenDto } from '../dto/refreshed-jwt.dto';
import {
  AUTH_FEATURE_BASE_PATH,
  AUTH_FEATURE_NAME,
} from '../config/auth.config';
import { PublicResource } from '../decorators/public-resource.decorator';
import { LocalAuthGuard } from '../guards/authentication/local-auth.guard';
import { RefreshAuthGuard } from '../guards/authentication/refresh-auth.guard';
import { CurrentUserId } from '../decorators/current-user-id.decorator';
import { FromCurrentUser } from '../decorators/current-user.decorator';
import { CustomerDto } from 'src/customers/dto/customer.dto';
import { CustomerMapper } from 'src/customers/mapper/customer.mapper';
import { LoginDto } from '../dto/login.dto';
import { RefreshTokenRequestDto } from '../dto/refresh-token-request.dto';
import { API_AUTH_TYPE } from 'src/constants';

@ApiTags(AUTH_FEATURE_NAME)
@ApiBearerAuth(API_AUTH_TYPE)
@Controller(AUTH_FEATURE_BASE_PATH)
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @PublicResource()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User successfully registered' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async register(
    @Body() registrationPayload: RegistrationDto,
  ): Promise<{ message: string }> {
    await this.authService.register(
      AuthMapper.fromRegistrationDto(registrationPayload),
    );

    return {
      message:
        'Your account was created successfully. You may proceed to login.',
    };
  }

  @Post('login')
  @PublicResource()
  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login a user' })
  @ApiResponse({
    status: 200,
    description: 'User successfully logged in',
    type: AuthResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBody({ type: LoginDto, description: 'User login details' })
  async login(
    @FromCurrentUser() loggedInUser: CustomerDto,
  ): Promise<AuthResponseDto> {
    console.log('IN CONTROLLER');
    const { customer, tokens } = await this.authService.login(
      CustomerMapper.fromDto(loggedInUser),
    );

    return AuthMapper.toAuthResponseDto(customer, tokens);
  }

  @Post('refresh-token')
  @PublicResource()
  @UseGuards(RefreshAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Refresh JWT Access Token' })
  @ApiResponse({
    status: 200,
    description: 'Token successfully refreshed',
    type: RefreshedTokenDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBody({
    type: RefreshTokenRequestDto,
    description: 'Refresh token request details',
  })
  async refreshToken(
    @CurrentUserId() customerId: string,
  ): Promise<RefreshedTokenDto> {
    return this.authService.refreshToken(customerId);
  }
}
