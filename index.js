const User = document.getElementById("users");
const Server = document.getElementById("servers");

async function GetUserCount() {
    try {
        const response = await fetch("https://bot.shapes.lol/user-count"); // Fetch the JSON data
        if (!response.ok) {
            User.innerHTML = "<strong>Offline</strong>";
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const UserCount = await response.text(); // Parse the JSON response

        // Set the Text To The Response
        User.innerHTML = `<strong>${UserCount}</strong>`;
    } catch (error) {
        console.error("Error fetching or processing data:", error);
        User.innerHTML = `ERROR: ${error}`;
    }
}
async function GetServerCount() {
    try {
        const response = await fetch("https://bot.shapes.lol/server-count"); // Fetch the JSON data
        if (!response.ok) {
            Server.innerHTML = "<strong>Offline</strong>";
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const ServerCount = await response.text(); // Parse the JSON response
        // Set the Text To The Response
        Server.innerHTML = `<strong>${ServerCount}</strong>`;
    } catch (error) {
        console.error("Error fetching or processing data:", error);
        Server.innerHTML = `ERROR: ${error}`;
    }
}
// GetUserCount();
// GetServerCount();
while (true) {
    GetUserCount();
    GetServerCount();
    sleep(9000);
}
