import { Injectable } from '@nestjs/common';
import { ForbiddenException } from '@nestjs/common/exceptions';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Prisma, User } from '@prisma/client';

import * as argon from 'argon2';
import { config } from 'process';
import { PrismaService } from '../prisma/prisma.service';
import { AuthDto, TokenResponse } from './dto';
import { JwtStrategy } from './strategy';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwt: JwtService,
        private config: ConfigService,
        private strat: JwtStrategy,
    ) {}

    async signup(dto: AuthDto) {
        const hash = await argon.hash(dto.password.toString());
        try {
            const user = await this.prisma.user.create({
                data: {
                    email: dto.email,
                    password: hash,
                },
            });
            return this.signToken(user.id, dto.email);
        } catch (error) {
            if (
                error.constructor.name ==
                Prisma.PrismaClientKnownRequestError.name
            ) {
                if (error.code === 'P2002') {
                    throw new ForbiddenException('Usuario registrado');
                }
            }
        }
    }

    async signin(dto: AuthDto): Promise<TokenResponse> {
        const user = await this.prisma.user.findUnique({
            where: {
                email: dto.email,
            },
        });
        //Valido si existe un usuario
        if (!user) {
            throw new ForbiddenException('Bad credentianls');
        }

        //Verifico contraseñas con Argon
        const isValid = await argon.verify(
            user.password,
            dto.password.toString(),
        );

        //Valido si la respuesta es verdadera
        if (!isValid) {
            throw new ForbiddenException('Bad credentials');
        }

        return this.signToken(user.id, user.email);
    }

    async signToken(userId: number, email: string): Promise<TokenResponse> {
        const token = await this.jwt.signAsync(
            { sub: userId, email: email },
            {
                expiresIn: '50m',
                secret: this.config.get('JWT_SECRET'),
            },
        );

        return {
            access_token: token,
        };
    }
}
