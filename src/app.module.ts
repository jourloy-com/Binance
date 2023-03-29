import {Module} from '@nestjs/common';
import {AppController} from './app/app.controller';
import {AppService} from './app/app.service';
import {BinanceModule} from './binance/binance.module';
import {MongooseModule} from "@nestjs/mongoose";
import {ConfigModule, ConfigService} from "@nestjs/config";

@Module({
	imports: [
		MongooseModule.forRootAsync({
			imports: [
				ConfigModule.forRoot(),
			],
			useFactory: async (configService: ConfigService) => ({
				uri: `mongodb://${configService.get<string>(`MONGO_HOST`)}/binance`,
			}),
			inject: [ConfigService],
		}),
		BinanceModule
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {
}
