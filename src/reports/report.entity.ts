import { User } from "src/users/user.entity";
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";

console.log(User);

@Entity()
export class Report {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: false })
  approved: boolean;

  @Column()
  price: number;

  @Column()
  make: string;

  @Column()
  model: string;

  @Column()
  year: number;

  @Column()
  lng: number;

  @Column()
  lat: number;

  @Column()
  mileage: number;

  //Isso gera uma alteração na tabela ao inserir um campo para identificar a qual usuário pertence esse report;
  @ManyToOne(() => User, (user) => user.reports)
  user: User;
}
