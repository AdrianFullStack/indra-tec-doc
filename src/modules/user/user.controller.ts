import {
  Controller,
  UseGuards,
  Get,
} from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from 'src/shared/guards/auth.guard';
import { AuthUser } from 'src/shared/decorators/auth-user.decorator';
import { ApiCookieAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('User')
@ApiCookieAuth()
@Controller('users')
@UseGuards(AuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Get('profile')
  @ApiOperation({ summary: 'Obtener datos del usuario logueado' })
  @ApiResponse({ status: 200, description: 'Lista datos de usuario.' })
  @ApiResponse({ status: 401, description: 'No autorizado.' })
  findOne(
    @AuthUser('sub') userId: string
  ) {
    return this.userService.findById(userId);
  }
}
