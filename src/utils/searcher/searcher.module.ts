import { Module } from '@nestjs/common';
import { SearcherService } from './searcher.service';

@Module({
  imports: [],
  providers: [SearcherService],
  exports: [SearcherService],
})
export class SearcherModule {}