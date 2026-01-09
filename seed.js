require("dotenv").config();
const mongoose = require("mongoose");
const Task = require("./src/models/Task");

async function seedDatabase() {
  try {
    // 1️⃣ Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // 2️⃣ Clean existing data
    const deletedCount = await Task.deleteMany();
    console.log(`🗑️ Deleted ${deletedCount.deletedCount || deletedCount} existing tasks`);

    // 3️⃣ Prepare sample tasks
    const sampleTasks = [
      // Study tasks
      {
        title: "Finish MongoDB project",
        description: "Complete NBD assignment",
        category: "study",
        priority: 5,
        project: "NBD",
        deadline: new Date("2026-01-15"),
        completed: false
      },
      {
        title: "Read MongoDB documentation",
        description: "Learn aggregation pipelines",
        category: "study",
        priority: 3,
        completed: true
      },
      {
        title: "Prepare for exam",
        category: "study",
        priority: 4,
        deadline: new Date("2026-01-20"),
        project: "University",
        completed: false
      },

      // Work tasks
      {
        title: "Team meeting",
        category: "work",
        priority: 4,
        project: "Office",
        deadline: new Date("2026-01-10"),
        completed: true
      },
      {
        title: "Send project report",
        category: "work",
        priority: 5,
        project: "Office",
        completed: false
      },
      {
        title: "Code review",
        category: "work",
        priority: 3,
        completed: false
      },

      // Personal tasks
      {
        title: "Buy groceries",
        category: "personal",
        priority: 2,
        completed: true
      },
      {
        title: "Go to gym",
        category: "personal",
        priority: 3,
        completed: false
      },
      {
        title: "Call mom",
        category: "personal",
        priority: 1,
        completed: true
      },

      // Other / misc tasks
      {
        title: "Organize bookshelf",
        category: "other",
        priority: 2,
        completed: false
      },
      {
        title: "Plan vacation",
        category: "other",
        priority: 4,
        deadline: new Date("2026-02-01"),
        completed: false
      },
      {
        title: "Fix bike",
        category: "other",
        priority: 3,
        completed: false
      }
    ];

    // 4️⃣ Insert sample tasks
    const insertedTasks = await Task.insertMany(sampleTasks);
    console.log(`✅ Inserted ${insertedTasks.length} tasks`);

    // Optional: log titles of all inserted tasks
    console.log("📋 Tasks inserted:");
    insertedTasks.forEach((t, i) => {
      console.log(`${i + 1}. ${t.title} [${t.category}] - Priority: ${t.priority} - Completed: ${t.completed}`);
    });

    console.log("🎉 Database seeded successfully!");
    process.exit();
  } catch (error) {
    console.error("❌ Seeding error:", error.message);
    process.exit(1);
  }
}

seedDatabase();
