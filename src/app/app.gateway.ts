import {Injectable, Logger} from "@nestjs/common";
import * as WebSocket from "isomorphic-ws";

@Injectable()
export class AppGateway {
	private bookTickerSocket = new WebSocket(`wss://data-stream.binance.com/ws/btcusdt@bookTicker`);
	private logger = new Logger(AppGateway.name);

	constructor() {
		this.bookTickerSocket.on(`open`, () => this.onWsOpen(`book ticker socket`));
		this.bookTickerSocket.on(`close`, (code) => this.onWsClose(code, `book ticker socket`));
		this.bookTickerSocket.on(`message`, (data) => this.onBookTickerMessage(this.dataParser(data)));
		this.bookTickerSocket.on(`ping`, () => this.onWsPing(this.bookTickerSocket));
	}

	private dataParser(data: WebSocket.RawData) {
		const parsed = JSON.parse(data.toString());
		parsed.b = Number(parsed.b);
		parsed.B = Number(parsed.B);
		parsed.a = Number(parsed.a);
		parsed.A = Number(parsed.A);
		return parsed;
	}

	private onWsOpen(who: string) {
		this.logger.log(`Connected ${who}`);
	}

	private onBookTickerMessage(data: IBookTicker) {
		this.logger.debug(data);
	}

	private onWsPing(ws: WebSocket) {
		ws.pong();
	}

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