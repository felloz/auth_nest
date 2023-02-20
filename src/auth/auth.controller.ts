import { Controller, Get, Post, Body } from '@nestjs/common';
import { User } from '@prisma/client';

import { AuthService } from './auth.service';
import { AuthDto } from './dto';

@Controller('api/auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('signup')
    signup(@Body() dto: AuthDto) {
        console.log({ dto });
        return this.authService.signup(dto);
    }

    @Post('signin')
    signin(@Body() dto: AuthDto): Promise<User> {
        return this.authService.signin(dto);
    }
}
