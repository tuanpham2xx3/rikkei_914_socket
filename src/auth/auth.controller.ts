import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service.js';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  registerUser(@Body() username: string, password: string): string {
    return this.authService.registerUser(username, password);
  }
}
