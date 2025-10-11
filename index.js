const User = document.getElementById("users");
const Server = document.getElementById("servers");

User.innerHTML = `<strong>Loading.</strong>`
Server.innerHTML = `<strong>Loading.</strong>`

User.innerHTML = `<strong>Loading..</strong>`
Server.innerHTML = `<strong>Loading..</strong>`


User.innerHTML = `<strong>Loading...</strong>`
Server.innerHTML = `<strong>Loading...</strong>`


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
            //throw new Error("Failed To Fetch");
            return
        }

        const data = await res.text();
        User.innerHTML = `<strong>${data}</strong>`;
        console.log(data, "Users Use Shapes!");
    }
    catch (err) {
        User.innerHTML = `<strong>Unknown</strong>`;
        //console.error(err);
        //Server.innerHTML = `<strong>${err}</strong>`;
    }
}

async function GetServerCount() {
    try {
        const res = await fetch("https://bot.shapes.lol/server-count");
        if (!res.ok) {
            //throw new Error("Failed To Fetch");
            return
        }

        const data = await res.text();
        Server.innerHTML = `<strong>${data}</strong>`;
        console.log(data, "Servers Use Shapes!");
    }
    catch (err) {
        Server.innerHTML = `<strong>Unknown</strong>`;
        //console.error(err);
        //Server.innerHTML = `<strong>${err}</strong>`;
    }
}

console.log("This Website Is A WIP")

GetServerCount();
GetUserCount();

setInterval(GetServerCount, 10000);
setInterval(GetUserCount, 10000);