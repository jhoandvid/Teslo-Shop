import { Module } from '@nestjs/common';
import { MessagesWsService } from './messages-ws.service';
import { MessagesWsGateway } from './messages-ws.gateway';
import { ProductsService } from 'src/products/products.service';
import { ProductsModule } from '../products/products.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  providers: [MessagesWsGateway, MessagesWsService, ],
  imports:[ AuthModule]
})
export class MessagesWsModule {}
