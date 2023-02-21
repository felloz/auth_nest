import { Controller, Get, UseGuards, Headers } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from '@prisma/client';
import { GetUser } from '../auth/decorator';

import { JwtGuard } from 'src/auth/guard';

@UseGuards(JwtGuard)
@Controller('api/user')
export class UserController {
    constructor() {}
    @Get('me')
    getMe(@GetUser() user: User) {
        return user;
    }
}
