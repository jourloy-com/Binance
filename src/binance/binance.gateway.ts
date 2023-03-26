import {WebSocketGateway} from '@nestjs/websockets';
import {BinanceService} from './binance.service';
import * as WebSocket from "isomorphic-ws";
import {Logger} from "@nestjs/common";

@WebSocketGateway()
export class BinanceGateway {
	private bookTickerSocket = new WebSocket(`wss://data-stream.binance.com/ws/btcusdt@bookTicker`);
	private logger = new Logger(BinanceGateway.name);

	constructor() {
		this.bookTickerSocket.on(`open`, () => this.onWsOpen(`book ticker socket`));
		this.bookTickerSocket.on(`close`, (code) => this.onWsClose(code, `book ticker socket`));
		this.bookTickerSocket.on(`message`, (data) => this.onBookTickerMessage(this.dataParser(data)));
		this.bookTickerSocket.on(`ping`, () => this.onWsPing(this.bookTickerSocket));
	}

	public currentBidPrice = 0;
	public currentAskPrice = 0;

	/**
	 * Parsing raw data from Binance into usable format
	 * @param data
	 * @private
	 */
	private dataParser(data: WebSocket.RawData) {
		const parsed = JSON.parse(data.toString());
		parsed.b = Number(parsed.b);
		parsed.B = Number(parsed.B);
		parsed.a = Number(parsed.a);
		parsed.A = Number(parsed.A);
		return parsed;
	}

	/**
	 * When socket connection open
	 * @param who
	 * @private
	 */
	private onWsOpen(who: string) {
		this.logger.log(`Connected ${who}`);
	}

	/**
	 * Get message from bookTicker stream
	 * @param data
	 * @private
	 */
	private onBookTickerMessage(data: IBookTicker) {
		this.currentAskPrice = data.a;
		this.currentBidPrice = data.b;
	}

	/**
	 * Pong on ping from Binance server
	 * @param ws
	 * @private
	 */
	private onWsPing(ws: WebSocket) {
		ws.pong();
	}

	/**
	 * When socket connection close
	 * @param code
	 * @param who
	 * @private
	 */
	private onWsClose(code: number, who: string) {
		this.logger.warn(`Disconnected ${who} with ${code} code`);
	}
}

interface IBookTicker {
	u: number;
	// Coin
	s: string;
	// Bid
	b: number;
	// Bid value
	B: number;
	// Ask
	a: number;
	// Ask value
	A: number;
}