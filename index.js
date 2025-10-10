const User = document.getElementById("users");
const Server = document.getElementById("servers");

function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function GetUserCountOLD() {
    fetch("https://bot.shapes.lol/user-count") // Fetch the data
        .then((res) => {
            if (!res.ok) {
                User.innerHTML = `<strong>Failed To Fetch ${res.ok} ${res.status}</strong>`
                throw new Error("Failed To Fetch");
            }
            return res.text();
        })
        .then((data) => {
            User.innerHTML = `<strong>${data}</strong>`
        })
        .catch((err) => console.error(err));
}

async function GetUserCount() {
    try {
        const res = await fetch("https://bot.shapes.lol/user-count");
        if (!res.ok) {
            User.innerHTML = `<strong>Unknown</strong>`;
            throw new Error("Failed To Fetch");
        }

        const data = await res.text();
        User.innerHTML = `<strong>${data}</strong>`;
        console.log(data, "Users Use Shapes!");
    }
    catch (err) {
        console.error(err);
        Server.innerHTML = `<strong>${err}</strong>`;
    }
}

async function GetServerCount() {
    try {
        const res = await fetch("https://bot.shapes.lol/server-count");
        if (!res.ok) {
            Server.innerHTML = `<strong>Unknown</strong>`;
            throw new Error("Failed To Fetch");
        }

        const data = await res.text();
        Server.innerHTML = `<strong>${data}</strong>`;
        console.log(data, "Servers Use Shapes!");
    }
    catch (err) {
        console.error(err);
        Server.innerHTML = `<strong>${err}</strong>`;
    }
}

GetServerCount();
GetUserCount();

// GetServerCount();
//while (true) {
//GetCountTest();
//GetUserCount();
//GetServerCount();
//wait(5000);
//}
