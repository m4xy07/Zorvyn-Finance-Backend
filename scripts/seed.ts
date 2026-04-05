import "dotenv/config";

import { addDays, subMonths } from "date-fns";

import { connectToDatabase } from "../src/lib/db";
import { hashPassword } from "../src/lib/auth";
import { DEMO_CATEGORIES } from "../src/constants";
import { FinancialRecordModel } from "../src/models/FinancialRecord";
import { UserModel } from "../src/models/User";

async function seed() {
  await connectToDatabase();

  await Promise.all([UserModel.deleteMany({}), FinancialRecordModel.deleteMany({})]);

  const [adminHash, analystHash, viewerHash] = await Promise.all([
    hashPassword("Admin@12345"),
    hashPassword("Analyst@12345"),
    hashPassword("Viewer@12345"),
  ]);

  const [admin, analyst, viewer] = await UserModel.create([
    {
      name: "Ava Admin",
      email: "admin@zorvyn.com",
      passwordHash: adminHash,
      role: "admin",
      status: "active",
    },
    {
      name: "Noah Analyst",
      email: "analyst@zorvyn.com",
      passwordHash: analystHash,
      role: "analyst",
      status: "active",
    },
    {
      name: "Mia Viewer",
      email: "viewer@zorvyn.com",
      passwordHash: viewerHash,
      role: "viewer",
      status: "active",
    },
  ]);

  const records: Array<{
    amount: number;
    type: "income" | "expense";
    category: string;
    date: Date;
    notes: string;
    createdBy: string;
  }> = [];

  const baseDate = subMonths(new Date(), 8);

  for (let monthOffset = 0; monthOffset < 9; monthOffset += 1) {
    const monthStart = addDays(subMonths(baseDate, -monthOffset), 1);

    records.push({
      amount: 12000 + monthOffset * 120,
      type: "income",
      category: "salary",
      date: addDays(monthStart, 1),
      notes: "Monthly salary payout",
      createdBy: admin.id,
    });

    records.push({
      amount: 1800 + monthOffset * 40,
      type: "income",
      category: "freelance",
      date: addDays(monthStart, 10),
      notes: "Consulting retainer",
      createdBy: admin.id,
    });

    const expenseTemplate = [
      { category: "travel", amount: 580 + monthOffset * 9 },
      { category: "food", amount: 420 + monthOffset * 7 },
      { category: "software", amount: 310 + monthOffset * 3 },
      { category: "tax", amount: 1400 + monthOffset * 11 },
      { category: "utilities", amount: 290 + monthOffset * 4 },
      { category: "subscriptions", amount: 260 + monthOffset * 4 },
      { category: "office", amount: 360 + monthOffset * 5 },
      { category: "marketing", amount: 730 + monthOffset * 8 },
    ];

    expenseTemplate.forEach((item, index) => {
      records.push({
        amount: item.amount,
        type: "expense",
        category: item.category,
        date: addDays(monthStart, 3 + index),
        notes: `${item.category} spending`,
        createdBy: monthOffset % 2 === 0 ? admin.id : analyst.id,
      });
    });

    const randomCategory = DEMO_CATEGORIES[monthOffset % DEMO_CATEGORIES.length];
    records.push({
      amount: 200 + monthOffset * 10,
      type: monthOffset % 3 === 0 ? "income" : "expense",
      category: randomCategory,
      date: addDays(monthStart, 17),
      notes: "Operational adjustment",
      createdBy: analyst.id,
    });
  }

  await FinancialRecordModel.insertMany(
    records.map((record) => ({
      ...record,
      createdBy: record.createdBy,
      softDeleted: false,
    })),
  );

  console.log("Seed complete");
  console.log("Users:");
  console.log("- admin@zorvyn.com / Admin@12345 (admin)");
  console.log("- analyst@zorvyn.com / Analyst@12345 (analyst)");
  console.log("- viewer@zorvyn.com / Viewer@12345 (viewer)");
  console.log(`Viewer account seeded: ${viewer.email}`);
  console.log(`Inserted ${records.length} financial records.`);
}

seed()
  .catch((error) => {
    console.error("Seed failed", error);
    process.exit(1);
  })
  .finally(() => {
    process.exit(0);
  });

