import {
  createUser,
  findUserByEmail,
  createTrip,
  getTripsByUserId,
  createActivity,
  getTripWithActivities,
} from "./db/queries";

async function testQueries() {
  try {
    console.log("🧪 Testing database queries...\n");

    // Test 1: Skapa användare
    console.log("1️⃣ Creating user...");
    const user = await createUser({
      email: "test@example.com",
      password: "hashedpassword123",
      name: "Test User",
    });
    console.log("✅ User created:", user.email);

    // Test 2: Hitta användare
    console.log("\n2️⃣ Finding user by email...");
    const foundUser = await findUserByEmail("test@example.com");
    console.log("✅ User found:", foundUser?.name);

    // Test 3: Skapa resa
    console.log("\n3️⃣ Creating trip...");
    const trip = await createTrip(user.id, {
      title: "Weekend i Stockholm",
      destination: "Stockholm, Sweden",
      start_date: "2025-06-01",
      end_date: "2025-06-03",
    });
    console.log("✅ Trip created:", trip.title);

    // Test 4: Skapa aktiviteter
    console.log("\n4️⃣ Creating activities...");
    await createActivity({
      trip_id: trip.id,
      day_number: 1,
      title: "Gamla Stan",
      description: "Utforska gamla stan",
      time: "10:00",
    });
    await createActivity({
      trip_id: trip.id,
      day_number: 1,
      title: "Vasa Museet",
      time: "14:00",
    });
    console.log("✅ Activities created");

    // Test 5: Hämta resa med aktiviteter
    console.log("\n5️⃣ Getting trip with activities...");
    const fullTrip = await getTripWithActivities(trip.id, user.id);
    console.log("✅ Trip with activities:", {
      title: fullTrip?.title,
      activities: fullTrip?.activities.length,
    });

    console.log("\n🎉 All tests passed!");
  } catch (error) {
    console.error("❌ Test failed:", error);
  } finally {
    process.exit(0);
  }
}

testQueries();