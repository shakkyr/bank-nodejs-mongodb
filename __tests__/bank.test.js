const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const app = require("../app");
const { BankModel, Transictions } = require("../model/bank.model");

let mongo;

beforeAll(async () => {
  mongo = await MongoMemoryServer.create();
  await mongoose.connect(mongo.getUri());
  await BankModel.init(); // build the unique index on accountNumber
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongo.stop();
});

beforeEach(async () => {
  await BankModel.deleteMany({});
  await Transictions.deleteMany({});
});

const addCustomer = (accountNumber, firstDeposit = 100) =>
  request(app).post("/api/bank").send({
    costumerName: `user ${accountNumber}`,
    email: `${accountNumber}@test.com`,
    id: String(accountNumber),
    firstDeposit,
    accountNumber,
  });

const balanceOf = async (accountNumber) => (await BankModel.findOne({ accountNumber })).firstDeposit;

describe("customers", () => {
  test("adds a customer and lists it", async () => {
    expect((await addCustomer(111111)).status).toBe(201);
    const res = await request(app).get("/api/bank");
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
  });

  test("rejects a duplicate account number with 409", async () => {
    await addCustomer(111111);
    expect((await addCustomer(111111)).status).toBe(409);
  });

  test("rejects an account number that is not 6 digits", async () => {
    expect((await addCustomer(123)).status).toBe(400);
  });

  test("gets one customer by account number, 404 when missing", async () => {
    await addCustomer(111111);
    expect((await request(app).get("/api/bank/account/111111")).body.accountNumber).toBe(111111);
    expect((await request(app).get("/api/bank/account/999999")).status).toBe(404);
  });
});

describe("transactions", () => {
  beforeEach(async () => {
    await addCustomer(111111, 100);
    await addCustomer(222222, 100);
  });

  test("deposit adds money and responds (used to hang forever)", async () => {
    const res = await request(app).put("/api/bank").send({ fromWho: 111111, deposit: "50", withdraw: "", transfer: "" });
    expect(res.status).toBe(200);
    expect(await balanceOf(111111)).toBe(150);
  });

  test("withdraw can use the 1000 credit but not more", async () => {
    const ok = await request(app).put("/api/bank").send({ fromWho: 111111, withdraw: "1100" });
    expect(ok.status).toBe(200);
    expect(await balanceOf(111111)).toBe(-1000);
    const tooMuch = await request(app).put("/api/bank").send({ fromWho: 111111, withdraw: "1" });
    expect(tooMuch.status).toBe(400);
    expect(await balanceOf(111111)).toBe(-1000);
  });

  test("transfer moves money and records a transaction", async () => {
    const res = await request(app).put("/api/bank").send({ fromWho: 111111, transfer: "30", toWho: 222222 });
    expect(res.status).toBe(200);
    expect(await balanceOf(111111)).toBe(70);
    expect(await balanceOf(222222)).toBe(130);
    const trans = await request(app).get("/api/bank/trans");
    expect(trans.body).toHaveLength(1);
  });

  test("negative transfer is rejected (would steal from the receiver)", async () => {
    const res = await request(app).put("/api/bank").send({ fromWho: 111111, transfer: "-500", toWho: 222222 });
    expect(res.status).toBe(400);
    expect(await balanceOf(222222)).toBe(100);
  });

  test("transfer to a missing account changes nothing", async () => {
    const res = await request(app).put("/api/bank").send({ fromWho: 111111, transfer: "30", toWho: 999999 });
    expect(res.status).toBe(404);
    expect(await balanceOf(111111)).toBe(100);
  });

  test("unknown sender returns 404 instead of crashing", async () => {
    const res = await request(app).put("/api/bank").send({ fromWho: 999999, deposit: "10" });
    expect(res.status).toBe(404);
  });

  test("parallel withdrawals cannot overspend", async () => {
    const results = await Promise.all(
      Array.from({ length: 5 }, () => request(app).put("/api/bank").send({ fromWho: 111111, withdraw: "500" }))
    );
    const succeeded = results.filter((r) => r.status === 200).length;
    expect(succeeded).toBe(2); // 100 + 1000 credit allows only two withdrawals of 500
    expect(await balanceOf(111111)).toBe(-900);
  });
});
