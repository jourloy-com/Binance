import {Controller, Get, Res} from '@nestjs/common';
import {BinanceService} from "./binance.service";
import {BinanceGateway} from "./binance.gateway";
import {Response} from "express";
import {EventPattern} from "@nestjs/microservices";

@Controller(`binance`)
export class BinanceController {
	constructor(
		private readonly binanceService: BinanceService,
		private readonly binanceGateway: BinanceGateway,
	) {}

	@Get(`/btcusdt`)
	@EventPattern(`/btcusdt`)
	async getCurrentPrice(@Res() response: Response) {
		const a = this.binanceGateway.currentAskPrice;
		const b = this.binanceGateway.currentBidPrice;
		response.status(200).json({ask: a, bid: b});
	}
}
