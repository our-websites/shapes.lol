const User = document.getElementById("users");
const Server = document.getElementById("servers");

async function GetUserCount() {
    try {
        const response = await fetch("https://bot.shapes.lol/user-count"); // Fetch the JSON data
        if (!response.ok) {
            User.innerHTML = "<strong>Offline</strong>";
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const UserCount = await response.json(); // Parse the JSON response

        // Set the Text To The Response
        User.innerHTML = `<strong>${UserCount["user_count"]}</strong>`;
    } catch (error) {
        console.error("Error fetching or processing data:", error);
        User.innerHTML = `<strong>ERROR: ${error}</strong>`;
    }
}
async function GetServerCount() {
    try {
        const response = await fetch("https://bot.shapes.lol/server-count"); // Fetch the JSON data
        if (!response.ok) {
            Server.innerHTML = "<strong>Offline</strong>";
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const ServerCount = await response.json(); // Parse the JSON response
        // Set the Text To The Response
        Server.innerHTML = `<strong>${ServerCount["server_count"]}</strong>`;
    } catch (error) {
        console.error("Error fetching or processing data:", error);
        Server.innerHTML = `<strong>ERROR: ${error}</strong>`;
    }
}
// GetUserCount();
// GetServerCount();
while (true) {
    GetUserCount();
    GetServerCount();
    sleep(9000);
}
