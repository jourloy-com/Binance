import {Module} from '@nestjs/common';
import {BinanceService} from './binance.service';
import {BinanceGateway} from './binance.gateway';
import {BinanceController} from "./binance.controller";
import {MongooseModule} from "@nestjs/mongoose";
import {BTCUSDT, BTCUSDTSchema} from "../schemas/btcusdt.schema";

@Module({
	imports: [
		MongooseModule.forFeature([
			{name: BTCUSDT.name, schema: BTCUSDTSchema}
		])
	],
	providers: [BinanceGateway, BinanceService],
	controllers: [BinanceController]
})
export class BinanceModule {
}
