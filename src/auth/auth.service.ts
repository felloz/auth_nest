import { Injectable } from '@nestjs/common';
import { ForbiddenException } from '@nestjs/common/exceptions';
import { Prisma, User } from '@prisma/client';

import * as argon from 'argon2';
import { PrismaService } from '../prisma/prisma.service';
import { AuthDto } from './dto';

@Injectable()
export class AuthService {
    constructor(private ps: PrismaService) {}

    async signup(dto: AuthDto) {
        const hash = await argon.hash(dto.password.toString());
        try {
            const user = await this.ps.user.create({
                data: {
                    email: dto.email,
                    password: hash,
                },
            });

            delete user.password;

            return user;
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

    async signin(dto: AuthDto): Promise<User> {
        const user = await this.ps.user.findUnique({
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

        delete (await user).password;

        return user;
    }
}
