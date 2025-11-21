// Add smooth scroll behavior
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Counting leaderboard fetch
const animateCounter = (element, target, duration = 1500) => {
    const start = Date.now();
    const startValue = 0;
    const endValue = parseInt(target);
    
    if (isNaN(endValue)) {
        element.textContent = target;
        return;
    }

    const update = () => {
        const now = Date.now();
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(startValue + (endValue - startValue) * eased);
        element.textContent = current.toLocaleString();
        
        if (progress < 1) {
            requestAnimationFrame(update);
        }
    };
    
    update();
};

const displayTopThree = (data) => {
    const container = document.getElementById('leaderboard-container');
    container.innerHTML = '';

    // Check if data is in the expected format
    let leaderboardData = [];
    if (Array.isArray(data)) {
        leaderboardData = data;
    } else if (data.Leaderboard) {
        // Handle the case where data is an object with a Leaderboard property
        leaderboardData = Array.from(data.Leaderboard).map(([, server]) => server);
    } else if (typeof data === 'object' && data !== null) {
        // Handle other object formats
        leaderboardData = Object.values(data);
    }

    const topThree = leaderboardData.slice(0, 3);

    topThree.forEach((server, index) => {
        const card = document.createElement('div');
        card.className = 'leaderboard-card';
        
        const rankClass = `rank-${index + 1}`;
        const rankNum = index + 1;

        card.innerHTML = `
          <div class="card-rank ${rankClass}">#${rankNum}</div>
          <div class="card-content">
            <div class="card-server-name">${escapeHtml(server.serverName || server.name || 'Unknown Server')}</div>
            <div class="card-stats">
              <div class="card-stat-row">
                <span class="card-stat-label">Current</span>
                <span class="card-stat-value counter-current-${index}">0</span>
              </div>
              <div class="card-stat-row">
                <span class="card-stat-label">Highest</span>
                <span class="card-stat-value counter-highest-${index}">0</span>
              </div>
            </div>
          </div>
        `;

        container.appendChild(card);

        const currentEl = card.querySelector(`.counter-current-${index}`);
        const highestEl = card.querySelector(`.counter-highest-${index}`);

        animateCounter(currentEl, server.currentnumber || server.current || 0);
        animateCounter(highestEl, server.highestnumber || server.highest || 0);
    });
};

const escapeHtml = (text) => {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
};

const fetchLeaderboard = async () => {
    try {
        const response = await fetch('https://bot.shapes.lol/clb');
        const data = await response.json();
        displayTopThree(data);
    } catch (error) {
        console.error('Failed to fetch leaderboard:', error);
    }
};

const fetchBotInfo = async () => {
    try {
        const response = await fetch('https://bot.shapes.lol/botinfo');
        const data = await response.json();
        
        const usersEl = document.getElementById('users');
        const serversEl = document.getElementById('servers');

        // Handle different data formats from botinfo endpoint
        const users = data.Users || data.users || data.userCount || 0;
        const servers = data.Servers || data.servers || data.guilds || data.serverCount || 0;

        if (usersEl && users !== undefined) {
            animateCounter(usersEl, users);
            console.log(`Serving ${users.toLocaleString()} users`);
            // Animate stats update if the function exists
            if (typeof animateStatsUpdate === 'function') {
                animateStatsUpdate();
            }
        }
        if (serversEl && servers !== undefined) {
            animateCounter(serversEl, servers);
            console.log(`Serving ${servers.toLocaleString()} servers`);
            // Animate stats update if the function exists
            if (typeof animateStatsUpdate === 'function') {
                animateStatsUpdate();
            }
        }
    } catch (error) {
        console.error('Failed to fetch bot info:', error);
        // Fallback to alternative endpoints
        fetchStatsAlternative();
    }
};

// Alternative endpoints if botinfo doesn't work
const fetchStatsAlternative = async () => {
    try {
        const [usersResponse, serversResponse] = await Promise.all([
            fetch('https://bot.shapes.lol/count/users'),
            fetch('https://bot.shapes.lol/count/servers')
        ]);

        const usersData = await usersResponse.json();
        const serversData = await serversResponse.json();
        
        const usersEl = document.getElementById('users');
        const serversEl = document.getElementById('servers');

        // Handle different data formats from count endpoints
        let usersUpdated = false;
        let serversUpdated = false;
        
        if (usersEl && usersData.Users !== undefined) {
            animateCounter(usersEl, usersData.Users);
            console.log(`Serving ${usersData.Users.toLocaleString()} users`);
            usersUpdated = true;
        } else if (usersEl && usersData.users !== undefined) {
            animateCounter(usersEl, usersData.users);
            console.log(`Serving ${usersData.users.toLocaleString()} users`);
            usersUpdated = true;
        }
        
        if (serversEl && serversData.Servers !== undefined) {
            animateCounter(serversEl, serversData.Servers);
            console.log(`Serving ${serversData.Servers.toLocaleString()} servers`);
            serversUpdated = true;
        } else if (serversEl && serversData.servers !== undefined) {
            animateCounter(serversEl, serversData.servers);
            console.log(`Serving ${serversData.servers.toLocaleString()} servers`);
            serversUpdated = true;
        }
        
        // Animate stats update if any values were updated
        if ((usersUpdated || serversUpdated) && typeof animateStatsUpdate === 'function') {
            animateStatsUpdate();
        }
    } catch (error) {
        console.error('Failed to fetch stats:', error);
    }
};

// Initialize data fetching
console.log('Initializing data fetching');
fetchLeaderboard();
fetchBotInfo();

// intervals for updating data
setInterval(fetchLeaderboard, 15000);
setInterval(fetchBotInfo, 30000);