import {WebSocketGateway} from '@nestjs/websockets';
import * as WebSocket from "isomorphic-ws";
import {Logger} from "@nestjs/common";
import {Model} from "mongoose";
import {InjectModel} from "@nestjs/mongoose";
import {BTCUSDT, BTCUSDTDocument} from "../schemas/btcusdt.schema";

@WebSocketGateway()
export class BinanceGateway {
	private bookTickerSocket = new WebSocket(`wss://data-stream.binance.com/ws/btcusdt@bookTicker`);
	private ticker = new WebSocket(`wss://data-stream.binance.com/ws/btcusdt@ticker`);
	private ticker1h = new WebSocket(`wss://data-stream.binance.com/ws/btcusdt@ticker_1h`);
	private ticker4h = new WebSocket(`wss://data-stream.binance.com/ws/btcusdt@ticker_4h`);
	private logger = new Logger(BinanceGateway.name);

	constructor(
		@InjectModel(BTCUSDT.name) private bookTickerModel: Model<BTCUSDTDocument>,
	) {
		this.bookTickerSocket.on(`open`, () => this.onWsOpen(`book ticker socket`));
		this.bookTickerSocket.on(`close`, (code) => this.onWsClose(code, `book ticker socket`));
		this.bookTickerSocket.on(`message`, (data) => this.onBookTickerMessage(this.bookTickerParser(data)));
		this.bookTickerSocket.on(`ping`, () => this.onWsPing(this.bookTickerSocket));

		this.ticker.on(`open`, () => this.onWsOpen(`ticker socket`));
		this.ticker.on(`close`, (code) => this.onWsClose(code, `ticker socket`));
		this.ticker.on(`message`, (data) => this.onTickerMessage(this.tickerParser(data, `24h`)));
		this.ticker.on(`ping`, () => this.onWsPing(this.ticker));

		this.ticker1h.on(`open`, () => this.onWsOpen(`ticker 1h socket`));
		this.ticker1h.on(`close`, (code) => this.onWsClose(code, `ticker 1h socket`));
		this.ticker1h.on(`message`, (data) => this.onTicker1hMessage(this.tickerParser(data, `1h`)));
		this.ticker1h.on(`ping`, () => this.onWsPing(this.ticker1h));

		this.ticker4h.on(`open`, () => this.onWsOpen(`ticker 4h socket`));
		this.ticker4h.on(`close`, (code) => this.onWsClose(code, `ticker 4h socket`));
		this.ticker4h.on(`message`, (data) => this.onTicker4hMessage(this.tickerParser(data, `4h`)));
		this.ticker4h.on(`ping`, () => this.onWsPing(this.ticker4h));
	}

	public ticker24: ITicker24h;
	public ticker1: ITicker1h;
	public ticker4: ITicker4h;
	public bookTicker: IBookTicker;

	private lastPrivateBTCUSDT = 0;

	/**
	 * Get message from book ticker stream
	 * @param data
	 * @private
	 */
	private onBookTickerMessage(data: IBookTicker) {
		this.bookTicker = data;

		if (Date.now() > this.lastPrivateBTCUSDT + 1000) {
			new this.bookTickerModel({
				a: data.a,
				A: data.A,
				b: data.b,
				B: data.B,
			}).save();
			this.lastPrivateBTCUSDT = Date.now();
		}
	}

	/**
	 * Get message from 24h ticker stream
	 * @param data
	 * @private
	 */
	private onTickerMessage(data: ITicker24h) {
		this.ticker24 = data;
	}

	/**
	 * Get message from 1h ticker stream
	 * @param data
	 * @private
	 */
	private onTicker1hMessage(data: ITicker1h) {
		this.ticker1 = data;
	}

	/**
	 * Get message from 4h ticker stream
	 * @param data
	 * @private
	 */
	private onTicker4hMessage(data: ITicker4h) {
		this.ticker4 = data;
	}

	/**
	 * Parsing raw data from Binance into usable format
	 * @param data
	 * @private
	 */
	private bookTickerParser(data: WebSocket.RawData) {
		const parsed = JSON.parse(data.toString());
		parsed.b = Number(parsed.b);
		parsed.B = Number(parsed.B);
		parsed.a = Number(parsed.a);
		parsed.A = Number(parsed.A);
		return parsed;
	}

	/**
	 * Parsing raw data from Binance into usable format
	 * @param data
	 * @param time
	 * @private
	 */
	private tickerParser(data: WebSocket.RawData, time: string) {
		const parsed = JSON.parse(data.toString());
		parsed.e = `${time}Ticker`;
		parsed.E = Number(parsed.e);
		parsed.s = Number(parsed.s);
		parsed.p = Number(parsed.p);
		parsed.P = Number(parsed.P);
		parsed.o = Number(parsed.o);
		parsed.h = Number(parsed.h);
		parsed.l = Number(parsed.l);
		parsed.c = Number(parsed.c);
		parsed.v = Number(parsed.v);
		parsed.w = Number(parsed.w);
		parsed.q = Number(parsed.q);
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

export interface IBookTicker {
	// Order book updateID
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

export interface ITicker {
	// Event time
	E: number;
	// Symbol
	s: string;
	// Price change
	p: number;
	// Price change percent
	P: number;
	// Open price
	o: number;
	// High price
	h: number;
	// Low price
	l: number;
	// Last price
	c: number;
	// Weighted average price
	w: number;
	// Total traded base asset volume
	v: number;
	// Total traded quote asset volume
	q: number;
	// Statistics open time
	O: number;
	// Statistics close time
	C: number;
	// First trade ID
	F: number;
	// Last trade ID
	L: number;
	// Total number of trades
	n: number;
}

export interface ITicker1h extends ITicker {
	// Event type
	e: `1hTicker`;
}

export interface ITicker4h extends ITicker {
	// Event type
	e: `4hTicker`;
}

export interface ITicker24h extends ITicker {
	// Event type
	e: `24hTicker`;
}