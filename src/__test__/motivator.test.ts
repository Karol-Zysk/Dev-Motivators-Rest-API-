import supertest from "supertest";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import createServer from "../utils/server";
import Motivator from "../models/motivator.model";

const app = createServer();

const userId = new mongoose.Types.ObjectId().toString();
const motivatorId = new mongoose.Types.ObjectId().toString();

const userPayload = {
  _id: userId,
  email: "Jane@example.com",
  login: "Jane23",
  password: "test1234",
  passwordConfirm: "test1234",
};

const motivatorPayload = {
  _id: motivatorId,
  title: "Test Motivator",
  subTitle: "Some text in subtitle",
  author: userId,
  image: "/images/John-Carmack",
  sluck: "test-motivator",
  keyWords: "Elo",
  thumbUp: [],
  thumbDown: [],
  place: "Purgatory",
};

describe("motivator tests", () => {
  beforeAll(async () => {
    app.use(cookieParser());
    const mongoServer = await MongoMemoryServer.create();

    await mongoose.connect(mongoServer.getUri());
  });

  afterEach(() => {
    jest.resetAllMocks();
  });
  beforeEach(() => {
    jest.clearAllMocks();
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
            author: null,
            createdAt: expect.any(String),
            id: expect.any(String),
            image: "/images/John-Carmack",
            keyWords: ["Elo"],
            place: expect.any(String),
            slug: "test-motivator",
            subTitle: "Some text in subtitle",
            thumbDown: [],
            thumbUp: [],
            title: "Test Motivator",
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
  it("POST /  should return status 401 and not create motivator when user is not logged in", async () => {
    const { statusCode, body } = await supertest(app)
      .post("/api/v1/motivators")
      .send(motivatorPayload);

    expect(statusCode).toBe(401);
    expect(body).not.toEqual({
      __v: 0,
      _id: expect.any(String),
      author: userPayload._id,
      createdAt: expect.any(String),
      id: expect.any(String),
      image: "/images/John-Carmack",
      keyWords: [],
      place: expect.any(String),
      slug: "test-motivator",
      subTitle: "Some text in subtitle",
      thumbDown: [],
      thumbUp: [],
      title: "Test Motivator",
    });
  });
  it("POST /  should return status 201 and create motivator user is logged in", async () => {
    const response = await supertest(app)
      .post("/api/v1/users/signup")
      .send(userPayload);

    const {
      body: { token: jwt },
    } = response;
    const { statusCode, body } = await supertest(app)
      .post("/api/v1/motivators")
      .set("Authorization", `Bearer ${jwt}`)
      .send(motivatorPayload);

    expect(statusCode).toBe(201);
    expect(body).toEqual({
      __v: 0,
      _id: expect.any(String),
      author: userPayload._id,
      createdAt: expect.any(String),
      id: expect.any(String),
      image: "/images/John-Carmack",
      keyWords: expect.any(Array),
      place: expect.any(String),
      slug: "test-motivator",
      subTitle: "Some text in subtitle",
      thumbDown: [],
      thumbUp: [],
      title: "Test Motivator",
    });
  });
  describe("Voting System", () => {
    it("PUT /givethumbup/:motivatorId  should return status 200 and vote if user logged in and didn't vote yet", async () => {
      const response = await supertest(app)
        .post("/api/v1/users/login")
        .send(userPayload);

      const {
        body: {
          data: {
            user: { id },
          },
          token: jwt,
        },
      } = response;
      await supertest(app)
        .post("/api/v1/motivators")
        .set("Authorization", `Bearer ${jwt}`)
        .send(motivatorPayload);

      const { statusCode } = await supertest(app)
        .put(`/api/v1/motivators/givethumbup/${motivatorPayload._id}`)
        .set("Authorization", `Bearer ${jwt}`);

      const {
        body: {
          data: {
            motivator: { thumbUp },
          },
        },
      } = await supertest(app).get(
        `/api/v1/motivators/${motivatorPayload._id}`
      );

      expect(statusCode).toBe(200);
      expect(thumbUp).toEqual([id]);
    });
    it("PUT /givethumbup/:motivatorId  should return status 403 if user is logged in and already voted", async () => {
      const response = await supertest(app)
        .post("/api/v1/users/login")
        .send(userPayload);

      const {
        body: {
          data: {
            user: { id },
          },
          token: jwt,
        },
      } = response;
      await supertest(app)
        .post("/api/v1/motivators")
        .set("Authorization", `Bearer ${jwt}`)
        .send(motivatorPayload);
      // First Vote
      await supertest(app)
        .put(`/api/v1/motivators/givethumbup/${motivatorPayload._id}`)
        .set("Authorization", `Bearer ${jwt}`);
      //Second Vote
      const { statusCode } = await supertest(app)
        .put(`/api/v1/motivators/givethumbup/${motivatorPayload._id}`)
        .set("Authorization", `Bearer ${jwt}`);

      expect(statusCode).toBe(403);
    });
  });
});
