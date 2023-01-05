import { report } from "process";
import { Report } from "src/reports/report.entity";
import { 
  Entity, 
  Column, 
  PrimaryGeneratedColumn, 
  AfterInsert, 
  AfterUpdate, 
  AfterRemove ,
  OneToMany
} from "typeorm";

console.log(Report)

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ default: true })
  admin: boolean;

  @AfterInsert()
  logInsert(){
    console.log('Inserted user with id', this.id)
  }

  @OneToMany(() => Report, (report) => report.user)
  reports: Report[];

  @AfterUpdate()
  logUpdate(){
    console.log('Updated User with id', this.id)
  }

  @AfterRemove()
  logRemove(){
    console.log('Removed User with id', this.id)
  }
}