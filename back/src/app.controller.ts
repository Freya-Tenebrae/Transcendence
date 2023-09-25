import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
  @Get('a')
  getBnuuy(): string {
	return this.appService.getBnuuy();
  }
  @Get("b")
  getB(): string {
	return ("b");
  }
}
