import {Controller, Get, Res} from "@nestjs/common";
import {BinanceService} from "./binance.service";
import {BinanceGateway} from "./binance.gateway";
import {Response} from "express";
import {EventPattern} from "@nestjs/microservices";

@Controller(`binance`)
export class BinanceController {
	constructor(
		private readonly binanceService: BinanceService,
		private readonly binanceGateway: BinanceGateway
	) {}

	@Get(`/btcusdt`)
	@EventPattern(`/btcusdt`)
	async getBTCUSDT(@Res() response: Response) {
		const bookTicker = this.binanceGateway.bookTicker;
		const ticker = this.binanceGateway.ticker24;
		const ticker1h = this.binanceGateway.ticker1;
		const ticker24h = this.binanceGateway.ticker24;

		response.status(200).json({
			bookTicker: bookTicker,
			ticker: ticker,
			ticker1h: ticker1h,
			ticker24: ticker24h,
		});
	}

	@Get(`/btcusdt/bookTicker`)
	@EventPattern(`/btcusdt/bookTicker`)
	async getCurrentPriceBTC(@Res() response: Response) {
		const bookTicker = this.binanceGateway.bookTicker;
		response.status(200).json(bookTicker);
	}

	@Get(`/btcusdt/ticker24`)
	@EventPattern(`/btcusdt/ticker24`)
	async getTicket24BTC(@Res() response: Response) {
		const ticker = this.binanceGateway.ticker24;
		response.status(200).json(ticker);
	}

	@Get(`/btcusdt/ticker4`)
	@EventPattern(`/btcusdt/ticker4`)
	async getTicket4BTC(@Res() response: Response) {
		const ticker = this.binanceGateway.ticker4;
		response.status(200).json(ticker);
	}

	@Get(`/btcusdt/ticker1`)
	@EventPattern(`/btcusdt/ticker1`)
	async getTicket1BTC(@Res() response: Response) {
		const ticker = this.binanceGateway.ticker1;
		response.status(200).json(ticker);
	}
}
