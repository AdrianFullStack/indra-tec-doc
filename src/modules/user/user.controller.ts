import {
  Controller,
  UseGuards,
  Request,
  Get,
} from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from 'src/shared/guards/auth.guard';
import { AuthUser } from 'src/shared/decorators/auth-user.decorator';

@Controller('users')
@UseGuards(AuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Get('profile')
  findOne(
    @AuthUser('sub') userId: string
  ) {
    return this.userService.findById(userId);
  }
}
