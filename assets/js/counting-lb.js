// This for top 10 per page so no need to show 20 server in same page or something like that
let currentPage = 1;
let leaderboardData = [];
const itemsPerPage = 10;

const exceptionLinks = [
    'https://discord.gg/avrjx6hsQC'
];

function containsDiscordUrl(serverName) {
    if (!serverName) return false;


    const lowerName = serverName.toLowerCase();

    const discordUrlPatterns = [
        'discord.gg/',
        '.gg/',
        'discord.com/invite/',
        'discordapp.com/invite/',
        'dsc.gg/'
    ];

    return discordUrlPatterns.some(pattern => lowerName.includes(pattern));
}

function filterLeaderboardData(data) {
    return data.filter(server => !containsDiscordUrl(server.serverName) || exceptionLinks.some(link => server.serverName.includes(link)));
}

function animateCounter(element, target, duration = 2000) {
    const start = Date.now();
    const startValue = 0;
    const endValue = parseInt(target);
    if (isNaN(endValue)) {
        element.textContent = target;
        return;
    }
    function update() {
        const now = Date.now();
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
        const current = Math.floor(startValue + (endValue - startValue) * eased);
        element.textContent = current.toLocaleString();
        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }
    update();
}

function updatePaginationControls() {
    const totalPages = Math.ceil(leaderboardData.length / itemsPerPage);
    const prevBtn = document.getElementById('prev-page');
    const nextBtn = document.getElementById('next-page');
    const pageInfo = document.getElementById('page-info');

    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === totalPages;
    pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
}

function displayPage(page) {
    const tbody = document.querySelector('#leaderboard tbody');
    tbody.innerHTML = '';

    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pageData = leaderboardData.slice(startIndex, endIndex);

    pageData.forEach((s, index) => {
        const tr = document.createElement('tr');
        const t1 = document.createElement('td');
        t1.dataset.label = 'server name';
        t1.textContent = s.serverName;

        const t2 = document.createElement('td');
        t2.dataset.label = 'current number';
        const sp2 = document.createElement('span');
        animateCounter(sp2, s.currentnumber);
        t2.appendChild(sp2);

        const t3 = document.createElement('td');
        t3.dataset.label = 'highest number';
        const sp3 = document.createElement('span');
        animateCounter(sp3, s.highestnumber);
        t3.appendChild(sp3);

        tr.append(t1, t2, t3);
        tbody.appendChild(tr);
    });
}

// Fetch leaderboard from "https://bot.shapes.lol/clb"
async function fetchLeaderboard(){
    try{
        const r = await fetch('https://bot.shapes.lol/clb');
        const d = await r.json();
        const rawData = Array.from(d.Leaderboard).map(([,s]) => s);
        // Apply filter to remove servers with Discord URLs
        leaderboardData = filterLeaderboardData(rawData);
        updatePaginationControls();
        displayPage(currentPage);
    }catch(e){}
}

document.getElementById('prev-page').addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        updatePaginationControls();
        displayPage(currentPage);
    }
});

document.getElementById('next-page').addEventListener('click', () => {
    const totalPages = Math.ceil(leaderboardData.length / itemsPerPage);
    if (currentPage < totalPages) {
        currentPage++;
        updatePaginationControls();
        displayPage(currentPage);
    }
});

fetchLeaderboard();setInterval(fetchLeaderboard,10000);