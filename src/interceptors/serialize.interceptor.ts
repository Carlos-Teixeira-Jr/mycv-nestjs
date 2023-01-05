import { 
  UseInterceptors,
  NestInterceptor,
  ExecutionContext,
  CallHandler
} from '@nestjs/common';
import { Observable } from 'rxjs';
import{ map } from 'rxjs/operators';
import { plainToInstance } from 'class-transformer';

//Interface que significa uma classe,logo, qualquer classe vai ser aceita como otipo que usar essa interface;
interface ClassConstructor {
  new (...args: any[]): {}
}

//Custom decorator para tornar o interceptor reutilizável em outras partes da aplicação e para tornar o decorator menos verboso na Controller;
export function Serialize(dto: ClassConstructor){
  return UseInterceptors(new SerializeInterceptor(dto));
}

export class SerializeInterceptor implements NestInterceptor{
  constructor(private dto: any){}

  intercept(context: ExecutionContext, handler: CallHandler): Observable<any>{

    return handler.handle().pipe(
      map((data: any) => {
        return plainToInstance(this.dto, data, {
          excludeExtraneousValues: true
        })
      })
    )
  }
}