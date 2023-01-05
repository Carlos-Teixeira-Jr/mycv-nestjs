import { Test } from '@nestjs/testing';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { BadRequestException } from '@nestjs/common';
import { NotFoundException } from '@nestjs/common/exceptions/not-found.exception';
import { EMPTY_OBSERVER } from 'rxjs/internal/Subscriber';

//Tudo está dentro dessa função describe apenas para que esse teste recebao nome de AuthService para facilitar a organização;
describe('AuthService', () => {
    
  let service: AuthService;
  let fakeUsersService: Partial<UsersService>;

  beforeEach(async () => {
    const users: User[] = [];
    //Cria uma cópia falsa do usersService;
    fakeUsersService = {
      find: (email:string) => {
        const filteredUsers = users.filter(user => user.email === email);
        return Promise.resolve(filteredUsers);
      },
      create: (email: string, password: string) => {
        const user = ({ id: Math.floor(Math.random() * 999999), email, password } as User);
        users.push(user);
        return Promise.resolve(user);
      }
    }

    //Indica que para a testagem será usada a versão falsa do usersService sempre que estefor solicitado;
    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: fakeUsersService
        }
      ]
    }).compile();

    service = module.get(AuthService);
  });

  it('can create an instance of auth service', async() => {
    expect(service).toBeDefined();
  });

  it('creates a new user with a salted and hashed password', async() => {
    const user = await service.signup('testeUnitário@teste.com', 'testeUnitário');

    expect(user.password).not.toEqual('testeUnitário');
    const [salt, hash] = user.password.split('.');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  it('throws an error if user signs up with email that is in use', async () => {
    fakeUsersService.find = () =>
 
      Promise.resolve([{ id: 1, email: 'a', password: '1' } as User]);
    await expect(service.signup('asdf@asdf.com', 'asdf')).rejects.toThrow(
      BadRequestException,
    );
  });

  it('throws if signin is called with an unused email', async () => {
    await expect(
      service.signin('asdflkj@asdlfkj.com', 'passdflkj'),
    ).rejects.toThrow(NotFoundException);
  });

  it('throws if an invalid password is provided', async () => {
    fakeUsersService.find = () =>
      Promise.resolve([
        { email: 'asdf@asdf.com', password: 'laskdjf' } as User,
      ]);
    await expect(
      service.signin('laskdjf@alskdfj.com', 'passowrd'),
    ).rejects.toThrow(BadRequestException);
  });

  it('returns a user if correct password is provided', async () => {
    await service.signup('doisdoisdois@gmail.com', 'terceiro');

    const user = await service.signin('doisdoisdois@gmail.com', 'terceiro');
    expect(user).toBeDefined();
  });
});
