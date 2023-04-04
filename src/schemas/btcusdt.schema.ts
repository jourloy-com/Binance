import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import {Document, Types} from "mongoose";

export type BTCUSDTDocument = BTCUSDT & Document;

@Schema()
export class BTCUSDT {
	_id?: Types.ObjectId;

	// Book ticker

	@Prop()
	bidPrice: number;

	@Prop()
	bidValue: number;

	@Prop()
	askPrice: number;

	@Prop()
	askValue: number;

	// Ticker 1 hour

	@Prop()
	priceChange1h: number;

	@Prop()
	openPrice1h: number;

	@Prop()
	closePrice1h: number;

	@Prop()
	highPrice1h: number;

	@Prop()
	lowPrice1h: number;

	// Ticker 4 hours

	@Prop()
	priceChange4h: number;

	@Prop()
	openPrice4h: number;

	@Prop()
	closePrice4h: number;

	@Prop()
	highPrice4h: number;

	@Prop()
	lowPrice4h: number;

	// Ticker 24 hours

	@Prop()
	priceChange24h: number;

	@Prop()
	openPrice24h: number;

	@Prop()
	closePrice24h: number;

	@Prop()
	highPrice24h: number;

	@Prop()
	lowPrice24h: number;

	// Other

	@Prop()
	timestamp: number;
}

export const BTCUSDTSchema = SchemaFactory.createForClass(BTCUSDT);