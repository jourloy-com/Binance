import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import {Document, Types} from "mongoose";

export type BTCUSDTDocument = BTCUSDT & Document;

@Schema({timestamps: true})
export class BTCUSDT {
	_id?: Types.ObjectId;

	// Bid
	@Prop()
	b: number;

	// Bid value
	@Prop()
	B: number;

	// Ask
	@Prop()
	a: number;

	// Ask value
	@Prop()
	A: number;
}

export const BTCUSDTSchema = SchemaFactory.createForClass(BTCUSDT);