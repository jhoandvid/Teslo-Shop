import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { MessagesWsService } from './messages-ws.service';
import {Socket, Server}  from 'socket.io'
import { ProductsService } from 'src/products/products.service';
import { Product } from '../products/entities/product.entity';
import { NewMessageDto } from './dtos/new-message.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from '../auth/interface/index';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../auth/entities/user.entity';
import { Repository } from 'typeorm';

@WebSocketGateway({cors:true})
export class MessagesWsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  
  @WebSocketServer() wss:Server

  constructor(private readonly messagesWsService: MessagesWsService,
              private readonly jwtService:JwtService,
              @InjectRepository(User)
              private readonly userRepository:Repository<User>
              
              ) {}


  async handleConnection(client: Socket) {

    const token=client.handshake.headers.authentication as string;
    let payload:JwtPayload;
    try{
      payload=this.jwtService.verify(token);
     await  this.messagesWsService.registerClient(client, payload.uid);
     


    }catch(error){
      client.disconnect();
      return;
    }
    

    //console.log('Cliente conectado:'+client.id);
  

    this.wss.emit('clients-updated', this.messagesWsService.getConnectedClients()); 

   



  }

  handleDisconnect(client: Socket) {
    //console.log('Cliente desconectado:'+client.id);
    this.messagesWsService.removeClient(client.id);
    this.wss.emit('clients-updated', this.messagesWsService.getConnectedClients()); 
    
  
  }

  
   //message-from-client
   @SubscribeMessage('message-from-client')
   handleMessageClient(client:Socket, payload:NewMessageDto){

        //!emite únicamente al cliente
      /* client.emit('message-from-server', {
        fullName:'Soy yo!',
        message:payload || 'no.message!'
      }) */


      //! emitir a todos menos, al cliente inicial
    /*   client.broadcast.emit('message-from-server',{
        fullName:'Soy yo!',
        message:payload || 'no.message!'
      }) */
    
      //Emitir a los usuarios conectados
      this.wss.emit('message-from-server',{
        fullName:this.messagesWsService.getUserFullName(client.id),
        message: payload.message|| 'no.message!'
      });

      
   }



  
 

  

}
