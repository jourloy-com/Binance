import {Module} from '@nestjs/common';
import {AppController} from './app/app.controller';
import {AppService} from './app/app.service';
import {TraderModule} from './trader/trader.module';
import {AppGateway} from "./app/app.gateway";

@Module({
	imports: [
		TraderModule
	],
	controllers: [AppController],
	providers: [AppService, AppGateway],
})
export class AppModule {
}
