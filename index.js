const User = document.getElementById("users");
const Server = document.getElementById("servers");

async function GetUserCount() {
    try {
        const response = await fetch("https://bot.shapes.lol/user-count"); // Fetch the data
        if (!response.ok) {
            User.innerHTML = "<strong>Offline</strong>";
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const UserCount = await response.text(); // Parse the response
        // Set the Text To The Response
        User.innerHTML = `<strong>${UserCount}</strong>`;
    } catch (error) {
        console.error("Error fetching or processing data:", error);
        User.innerHTML = `ERROR: ${error}`;
    }
}
async function GetServerCount() {
    try {
        const response = await fetch("https://bot.shapes.lol/server-count"); // Fetch the data
        if (!response.ok) {
            Server.innerHTML = "<strong>Offline</strong>";
            throw new Error(`HTTP error! status: ${response.status}`);
        } else {
            Server.innerHTML = `<strong>${response.body()}</strong>`;
        }
        const ServerCount = await response.text(); // Parse the response
        // Set the Text To The Response
        
    } catch (error) {
        console.error("Error fetching or processing data:", error);
        Server.innerHTML = `ERROR: ${error}`;
    }
}
GetUserCount();
GetServerCount();
sleep(1000)
while (true) {
    GetUserCount();
    GetServerCount();
    sleep(9000);
}
