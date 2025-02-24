import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AppService } from './app.service';
import { Auth } from './auth/decorators/auth.decorator';
import { AuthType } from './auth/enums/auth-type.enum';

@ApiTags('Default')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Auth(AuthType.None)
  @ApiOperation({
    summary: 'Returns a greeting message just to test the server is working',
  })
  @ApiResponse({
    status: 200,
    description: 'Successful response',
    type: 'string',
  })
  getHello(): string {
    return this.appService.getHello();
  }
}
