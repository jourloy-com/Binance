import {Module} from '@nestjs/common';
import {TraderService} from './trader.service';
import {TraderController} from './trader.controller';

@Module({
	controllers: [TraderController],
	providers: [TraderService]
})
export class TraderModule {
}
