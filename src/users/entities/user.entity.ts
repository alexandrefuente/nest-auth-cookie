import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ nullable: false, length: 150 })
  name: string;
  @Column({ unique: true, nullable: false, length: 150 })
  email: string;
  @Column()
  password: string;
  @Column({ nullable: true, length: 255 })
  img_user: string;
}
