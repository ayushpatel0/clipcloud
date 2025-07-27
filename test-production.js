// Test registration without mock database
const testEmail = "production-test@example.com";
const testPassword = "password123";

async function testRegistration() {
	try {
		console.log("Testing registration without mock database...");

		const response = await fetch("http://localhost:3001/api/auth/register", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				email: testEmail,
				password: testPassword,
			}),
		});

		const data = await response.json();

		console.log("Status:", response.status);
		console.log("Response:", data);

		if (response.ok) {
			console.log("✅ Registration successful - MongoDB Atlas only!");
		} else {
			console.log("❌ Registration failed!");
		}
	} catch (error) {
		console.error("❌ Error testing registration:", error);
	}
}

testRegistration();
