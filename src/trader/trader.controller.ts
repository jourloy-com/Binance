import {Controller} from '@nestjs/common';
import {TraderService} from './trader.service';

@Controller(`trader`)
export class TraderController {
	constructor(private readonly traderService: TraderService) {
	}
}
