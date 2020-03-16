import * as Provider from "./LectureProvider";

describe("LectureProvider", () => {
  xit("should fetch lecture data from ATMB3_H1", async () => {
    const result = await Provider.getLectures("ATMB3_H1");

    const expected = [
      {
        index: 0,
        courseId: "ATMB3_H1",
        id: "V41002101",
        name: "컴퓨터수학",
        professor: "이민나",
        time: "월 1 2 3",
        isEmpty: true
      }
    ];
    expect(result).toEqual(expected);
  });
});
