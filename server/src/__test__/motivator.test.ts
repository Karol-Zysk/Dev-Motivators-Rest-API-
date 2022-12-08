import supertest from "supertest";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import Motivator from "../models/motivator.model";
import createServer from "../utils/server";

const app = createServer();

const motivatorPayload = {
  title: "IIII like to play Idle Heroes",
  subTitle: "Fajne gry tworzył",
  author: true,
  image: "/images/John-Carmack",
  sluck: "elo-ziomki-yoyo",
  keyWords: "Elo",
  thumbUp: 19,
  place: "Purgatory",
};

describe("motivator tests", () => {
  beforeAll(async () => {
    const mongoServer = await MongoMemoryServer.create();

    await mongoose.connect(mongoServer.getUri());
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoose.connection.close();
  });
  it("GET /  shuld return statusCode 200 and all motivators array", async () => {
    await Motivator.create(motivatorPayload);
    const { body } = await supertest(app).get("/api/v1/motivators").expect(200);

    expect(body).toEqual({
      data: {
        allMotivators: [
          {
            _id: expect.any(String),
            author: "true",
            createdAt: expect.any(String),
            id: expect.any(String),
            image: "/images/John-Carmack",
            keyWords: ["Elo"],
            place: "Purgatory",
            slug: "iiii-like-to-play-idle-heroes",
            subTitle: "Fajne gry tworzył",
            thumbDown: 0,
            thumbUp: 19,
            title: "IIII like to play Idle Heroes",
          },
        ],
      },
      lenght: 1,
      status: "success",
    });
  });
  it("GET /:id  shuld return statusCode 404 if motivator with given Id doesen't exist", async () => {
    const motivatorId = 123;
    const { statusCode } = await supertest(app).get(
      `/api/v1/motivators/${motivatorId}`
    );
    expect(statusCode).toBe(404);
  });
  it("POST /  should return status 200 and create motivator if correct data", async () => {
    const { statusCode, body } = await supertest(app)
      .post("/api/v1/motivators/")
      .send(motivatorPayload);

    expect(statusCode).toBe(200);
    expect(body).toEqual({
      __v: 0,
      _id: expect.any(String),
      author: "Anonymus",
      createdAt: expect.any(String),
      id: expect.any(String),
      image: "/images/John-Carmack",
      keyWords: [],
      place: "Waiting",
      slug: "iiii-like-to-play-idle-heroes",
      subTitle: "Fajne gry tworzył",
      thumbDown: 0,
      thumbUp: 0,
      title: "IIII like to play Idle Heroes",
    });
  });
});
