import * as bcrypt from 'bcryptjs';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  OneToOne,
  JoinColumn,
  ManyToOne,
  Generated,
} from 'typeorm';

import { BaseDeleteEntity } from '../app/databases/common/BaseDeleteEntity';
import { Profile } from './Profile';
import { Donation } from './Donation';
import { Contributor } from './Contributor';
import { Organization } from './Organization';
import { Cart } from './Cart';
import { Transaction } from './Transaction';

@Entity('user')
export class User extends BaseDeleteEntity {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column({ nullable: true })
  confirmedAt?: Date;

  @Column({ unique: true, nullable: true })
  email?: string;

  @Column('simple-array', { nullable: true })
  accessToken?: string[];

  @Column('simple-array', { nullable: true })
  refreshToken?: string[];

  @Column({ nullable: true })
  username?: string;

  @Column({ nullable: true })
  token?: string;

  @Column({ nullable: true })
  password?: string;

  @Column({ type: 'uuid', nullable: true })
  profileId?: string;

  @Column({ type: 'uuid', nullable: true })
  organizationInUtilizationId?: string;

  @OneToOne(() => Profile, (profile) => profile.user, { onDelete: 'CASCADE' })
  @JoinColumn()
  profile?: Profile;

  @OneToMany(() => Donation, (donation) => donation.organization)
  donations?: Donation[];

  @OneToMany(() => Organization, (organization) => organization.user, {
    onDelete: 'CASCADE',
  })
  organizations?: Organization[];

  @OneToMany(() => Transaction, (transaction) => transaction.user, {
    onDelete: 'CASCADE',
  })
  transactions?: Transaction[];

  @OneToMany(() => Contributor, (contributor) => contributor.userId, {
    onDelete: 'CASCADE',
  })
  contributors?: Contributor[];

  @OneToMany(() => Cart, (cart) => cart.userId, {
    onDelete: 'CASCADE',
  })
  carts?: Cart[];

  @ManyToOne(() => Organization, (organization) => organization.users, {
    onDelete: 'CASCADE',
  })
  @JoinColumn([
    { name: 'organizationInUtilizationId', referencedColumnName: 'id' },
  ])
  organizationInUtilization?: Organization;

  async hashPassword(password: string) {
    this.password = await bcrypt.hashSync(
      String(password) || String(this.password),
      8,
    );
  }

  checkIfPasswordMatch(password: string) {
    return bcrypt.compareSync(String(password), String(this.password));
  }
}
