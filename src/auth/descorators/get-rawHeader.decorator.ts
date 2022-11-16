import { createParamDecorator, ExecutionContext } from '@nestjs/common';


export const RawHeader=createParamDecorator(
    (data, cxt:ExecutionContext)=>{

        const req=cxt.switchToHttp().getRequest();

        const rawHeader=req.rawHeaders;

        

        return rawHeader;
        

    }
)