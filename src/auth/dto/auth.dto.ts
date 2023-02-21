import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class AuthDto {
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsString()
    @IsNotEmpty()
    password: String;
}

export interface TokenResponse {
    access_token: string;
}

export interface TokenRequest {
    sub: number;
    email: string;
}
