import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'users' })
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({nullable:false})
  firstName: string;

  @Column({nullable:false})
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column({type:'varchar', length:300,nullable:false})
  password:string

  @CreateDateColumn()
  date_create: string;

  @UpdateDateColumn()
  date_update: string;


  @Column({
    type: "enum",
    enum: ["Admin","User"],
    default: "User"
  })
  role: string;
}
