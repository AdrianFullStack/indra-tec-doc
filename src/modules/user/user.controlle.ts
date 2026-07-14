import {
  Controller,
  UseGuards,
  Request,
  Get,
} from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from 'src/shared/guards/auth.guard';

@Controller('users')
@UseGuards(AuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) { }
}