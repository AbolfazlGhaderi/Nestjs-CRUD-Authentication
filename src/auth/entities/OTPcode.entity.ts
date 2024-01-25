import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'otpcode' })
export class OTPCode {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  code:string

  @Column({type:'boolean',default:false})
  isused:boolean
}
