const User = document.getElementById("users");
const Server = document.getElementById("servers");

async function GetUserCount() {
    fetch("https://bot.shapes.lol/user-count") // Fetch the data
        .then((res) => {
            if(!res.ok) {
                User.innerHTML = `<strong>Failed To Fetch</strong>`
                throw new Error("Failed To Fetch");
            }
            return res.text();
        })
        .then((data) => User.innerHTML = `<strong>${data}</strong>`)
        .catch((err) => console.error(err));
}

async function GetCountTest() {
    try {
        const res = await fetch("https://bot.shapes.lol/server-count");

        if(!res.ok){
            throw new Error("Failed To Fetch");
        }

        const data = await res.text();
        Server.innerHTML = `<strong>${data}</strong>`;
        console.log(data);
    }
    catch(err){
        console.error(err);
    }
}

GetCountTest();
GetUserCount();
// GetServerCount();
sleep(1000);
while (true) {
    GetCountTest();
    GetUserCount();
    //GetServerCount();
    sleep(9000);
}
