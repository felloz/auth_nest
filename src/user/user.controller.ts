import { Controller, Get } from '@nestjs/common';

@Controller('api/user')
export class UserController {
    @Get('test')
    test(): string {
        return 'test user works..';
    }
}
