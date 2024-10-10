import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from 'src/user/user.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userServices: UserService,
    private jwtServices: JwtService,
  ) {}

  async register({ username, email, password }: RegisterDto) {
    // Verificar si el nombre de usuario o el correo electrónico ya están en uso
    const existingUser = await this.userServices.findOneEmail(email);

    if (existingUser) {
      throw new ConflictException('El nombre de usuario o el correo electrónico ya están en uso.');
    }

    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(password, 10); // 10 es el número de rondas de sal

    // Crear el usuario en la base de datos
    return this.userServices.create({
      username,
      email,
      password: hashedPassword, // Reemplaza la contraseña con el hash
    });
  }
  async login({ email, password }: LoginDto) {
    const existingUser = await this.userServices.findOneEmail(email);
    if (!existingUser) throw new UnauthorizedException('email is wrong!! ');

    const isPasswordValid = await bcrypt.compare(password, existingUser.password);
    if (!isPasswordValid) throw new UnauthorizedException('password is wrong!!');

    const payload = { email: existingUser.email };

    const token = await this.jwtServices.signAsync(payload);
    return { token, email };
  }
}
