import { Expose } from 'class-transformer';

export class UserDto{
  //Decorator que indica quais propriedades devem ser mostradas na resposta;
  @Expose()
  id: number;

  @Expose()
  email: string;
}