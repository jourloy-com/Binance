import {Module} from '@nestjs/common';
import {AppController} from './app/app.controller';
import {AppService} from './app/app.service';
import {TraderModule} from './trader/trader.module';
import {BinanceModule} from './binance/binance.module';

@Module({
	imports: [
		TraderModule,
		BinanceModule
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {
}
