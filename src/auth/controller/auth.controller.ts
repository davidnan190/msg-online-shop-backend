import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { RegistrationDto } from '../dto/registration.dto';
import { AuthService } from '../service/auth.service';
import { Request } from 'express';
import { AuthResponseDto } from '../dto/auth-response.dto';
import { AuthMapper } from '../mapper/auth.mapper';
import { RefreshedTokenDto } from '../dto/refreshed-jwt.dto';
import { LocalAuthGuard } from '../guards/local-auth.guard';
import { PublicResource } from '../decorators/public-resource.decorator';
import { RefreshAuthGuard } from '../guards/refresh-auth.guard';
import { CurrentUserId } from '../decorators/current-user-id.decorator';
import {
  AUTH_FEATURE_BASE_PATH,
  AUTH_FEATURE_NAME,
} from '../config/auth.config';

@ApiTags(AUTH_FEATURE_NAME)
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
  @ApiResponse({ status: 200, description: 'User successfully logged in' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async login(@Req() req: Request): Promise<AuthResponseDto> {
    console.log('IN CONTROLLER');
    const { customer, tokens } = await this.authService.login(req.user);

    return AuthMapper.toAuthResponseDto(customer, tokens);
  }

  @Post('refresh-token')
  @PublicResource()
  @UseGuards(RefreshAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh JWT Access Token' })
  @ApiResponse({ status: 200, description: 'Token successfully refreshed' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async refreshToken(
    @CurrentUserId() customerId: string,
  ): Promise<RefreshedTokenDto> {
    return this.authService.refreshToken(customerId);
  }
}
