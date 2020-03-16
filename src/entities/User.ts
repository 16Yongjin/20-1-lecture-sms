import { Lecture } from ".";
import {
  Entity,
  BaseEntity,
  PrimaryColumn,
  ManyToMany,
  JoinTable,
  Column
} from "typeorm";

@Entity()
export class User extends BaseEntity {
  @PrimaryColumn("text")
  id: string;

  @Column()
  check: boolean = false;

  @ManyToMany(
    () => Lecture,
    lecture => lecture.users
  )
  @JoinTable()
  lectures: Lecture[];

  removeLecture(lectureId: string) {
    return User.createQueryBuilder()
      .relation(User, "lectures")
      .of({ id: this.id })
      .remove(lectureId);
  }
}
