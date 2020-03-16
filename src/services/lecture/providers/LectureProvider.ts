import request from "request-promise";
import cheerio from "cheerio";
import { logger } from "./../../../utils/logger";
import { Lecture } from "./../../../entities/Lecture";

type FetchedLecture = {
  index: number;
  id: string;
  name: string;
  professor: string;
  time: string;
  courseId: string;
  isEmpty: boolean;
};

const url = "https://wis.hufs.ac.kr/src08/jsp/lecture/LECTURE2020L.jsp";

const buildForm = (courseId: string) => {
  return {
    ag_ledg_year: "2020",
    ag_ledg_sessn: "1",
    ag_org_sect: "A",
    campus_sect: courseId.slice(0, 2),
    gubun: courseId.startsWith("A") ? "1" : "2",
    ag_crs_strct_cd: courseId,
    ag_compt_fld_cd: courseId
  };
};

const fetchCourseHtml = (courseId: string) =>
  request.post(url, { form: buildForm(courseId) });

const trim = (str: string) =>
  str
    .trim()
    .replace(/\s{2,}/, "")
    .replace(/\s?\(.+$/, "");

function isEmpty(people: string): boolean {
  try {
    return Boolean(people && eval(people) < 1);
  } catch {
    return false;
  }
}

export const getLectures = async (
  courseId: string
): Promise<FetchedLecture[]> => {
  const html = await fetchCourseHtml(courseId);
  const $ = cheerio.load(html);
  const trs = $("#premier1 tr");

  const lectures: FetchedLecture[] = $(trs)
    .map((index, tr) => {
      if (!index) return;

      const tds = $(tr).children("td");

      const [id, name, professor, time, people] = [3, 4, 11, 14, 15].map(i =>
        trim(tds.eq(i).text())
      );

      const lecture: FetchedLecture = {
        index: index - 1,
        courseId,
        id,
        name,
        professor,
        time,
        isEmpty: isEmpty(people)
      };

      return lecture;
    })
    .get();

  return lectures;
};

export const filterLectures = async (
  courseId: string,
  lectures: Lecture[]
): Promise<Lecture[]> => {
  console.time(`fetch ${courseId}`);

  const fetchedLectures = await getLectures(courseId).catch((e: Error) => {
    logger.error(`[Feching Lecture Error] courseId: ${courseId}, ${e.message}`);
    return [];
  });

  console.timeEnd(`fetch ${courseId}`);

  if (!fetchedLectures) return [];

  return lectures.filter(lecture => fetchedLectures[lecture.index]?.isEmpty);
};
