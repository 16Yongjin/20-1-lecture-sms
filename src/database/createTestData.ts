import { User, Lecture } from "../entities";

const seedLectures = (): Promise<Lecture[]> => {
  const lectures = [
    Lecture.create({
      id: "V41002101",
      index: 0,
      name: "컴퓨터수학",
      professor: "이민나",
      time: "월 1 2 3",
      courseId: "ATMB3_H1"
    }),
    Lecture.create({
      id: "J11004101",
      index: 0,
      name: "러시아.투르크.몽골의민족과종교",
      professor: "이난아",
      time: "월 7 8",
      courseId: "AAR01_H1"
    }),
    Lecture.create({
      id: "J11002101",
      index: 2,
      name: "서양문학과대중문화",
      professor: "임형진",
      time: "수 7 8",
      courseId: "AAR01_H1"
    }),
    Lecture.create({
      id: "U72207302",
      index: 1,
      name: "컴퓨터프로그래밍",
      professor: "이선순",
      time: "금 4 5 6",
      courseId: "308_H1"
    }),
    Lecture.create({
      id: "U71189101",
      index: 2,
      name: "애니메이션일본어1",
      professor: "최현필",
      time: "월 1 2",
      courseId: "355_H1"
    }),
    Lecture.create({
      id: "U71187101",
      index: 1,
      name: "드라마일본어1",
      professor: "송연희",
      time: "목 9 10",
      courseId: "355_H1"
    })
  ];

  return Lecture.save(lectures);
};

const seedUser = (lectures: Lecture[]): Promise<User[]> => {
  const alarms = [
    User.create({
      id: "1",
      lectures: lectures.slice(0, 2)
    }),
    User.create({
      id: "2",
      lectures: lectures.slice(1, 3)
    }),
    User.create({
      id: "3",
      lectures: lectures.slice(4)
    })
  ];

  return User.save(alarms);
};

const createTestData = async (): Promise<void> => {
  const lectures = await seedLectures();
  const alarms = await seedUser(lectures);
};

export default createTestData;
