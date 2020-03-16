import { Server } from "socket.io";
import "dotenv/config";
import "reflect-metadata";
import request from "supertest";
import { Router } from "express";
import { Connection } from "typeorm";

import initializeApp from "./app";
import createTestDatabaseConnection from "./database/connectTest";
import createTestData from "./database/createTestData";

let router: Router;
let connection: Connection;
let io: Server;

beforeAll(async () => {
  connection = await createTestDatabaseConnection();
  await createTestData();
  router = initializeApp();
});

afterAll(async () => {
  await connection.dropDatabase();
  await connection.close();
});

describe("Lecture Service", () => {
  describe("GET /lectures/:courseId", () => {
    it("코스명 ATMB3_H1 강의들 가져오기", async () => {
      const response = await request(router).get("/lectures/ATMB3_H1");
      expect(response.status).toEqual(200);
      expect(response.body).toHaveLength(1);
    });
  });

  describe("GET /lectures/search", () => {
    it.only("컴퓨터가 들어가는 강의 검색하기", async () => {
      const response = await request(router).get(
        `/lectures/search?name=${encodeURIComponent("컴퓨터")}`
      );
      expect(response.status).toEqual(200);
      expect(response.body).toHaveLength(2);
    });

    it.only("이민나 교수님 강의 검색하기", async () => {
      const response = await request(router).get(
        `/lectures/search?name=${encodeURIComponent("이민나")}`
      );
      expect(response.status).toEqual(200);
      expect(response.body).toHaveLength(1);
    });
  });
});

describe("User Service", () => {
  describe("GET /users/:id", () => {
    it("기존 유저 가져오기", async () => {
      const response = await request(router).get("/users/1");
      expect(response.status).toEqual(200);
      expect(response.body).toHaveLength(2);
    });

    it("없으면 생성해서 유저 가져오기", async () => {
      const response = await request(router).get("/users/newuser");
      expect(response.status).toEqual(200);
      expect(response.body).toHaveLength(0);
    });
  });

  describe("POST /users", () => {
    it("알람이 2개인 기존 유저에 알람 추가", async () => {
      const existingUserRes = await request(router).get("/users/2");
      expect(existingUserRes.status).toEqual(200);
      expect(existingUserRes.body).toHaveLength(2);

      const response = await request(router)
        .post("/users")
        .send({
          userId: "2",
          lectureId: "V41002101"
        });

      expect(response.status).toEqual(200);
      expect(response.body).toHaveLength(3);
    });

    it("기존에 없던 유저에 알람 추가 ", async () => {
      const response = await request(router)
        .post("/users")
        .send({
          userId: "100",
          lectureId: "V41002101"
        });

      expect(response.status).toEqual(200);
      expect(response.body).toHaveLength(1);
    });

    it("이미 추가된 알람은 가볍게 무시", async () => {
      const response1 = await request(router)
        .post("/users")
        .send({
          userId: "addAgain",
          lectureId: "V41002101"
        });

      expect(response1.status).toEqual(200);
      expect(response1.body).toHaveLength(1);

      const response2 = await request(router)
        .post("/users")
        .send({
          userId: "addAgain",
          lectureId: "V41002101"
        });

      expect(response2.status).toEqual(200);
      expect(response2.body).toHaveLength(1);
    });

    it("존재하지 않는 강의 등록 시 400 에러", async () => {
      const response = await request(router)
        .post("/users")
        .send({
          userId: "100",
          lectureId: "INVALID"
        });

      expect(response.status).toEqual(400);
    });
  });

  describe("DELETE /users/:userId/:lectureId", () => {
    it("기존 유저의 알람 삭제", async () => {
      const existingUserRes = await request(router).get("/users/3");
      expect(existingUserRes.status).toEqual(200);
      expect(existingUserRes.body).toHaveLength(2);

      const response = await request(router).delete("/users/3/U71189101");

      expect(response.status).toEqual(200);
      expect(response.body).toHaveLength(1);
    });

    it("없는 유저는 생성 후 알람이 빈 상태로 반환", async () => {
      const response = await request(router).delete(
        "/users/deleteNon-ExisintgUser/U71189101"
      );

      expect(response.status).toEqual(200);
      expect(response.body).toHaveLength(0);
    });
  });
});

describe("Admin Service", () => {
  describe("/admin/users", () => {
    it("모든 유저 가져옴", async () => {
      const response = await request(router).get("/admin/users");
      expect(response.status).toEqual(200);
    });
  });

  describe("/admin/alarms", () => {
    it("알람으로 등록된 모든 강의 가져옴", async () => {
      const response = await request(router).get("/admin/alarms");
      expect(response.status).toEqual(200);
    });
  });
});
