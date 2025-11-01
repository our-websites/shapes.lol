const User = document.getElementById("users");
const Server = document.getElementById("servers");

function displayLoadingAnimation() {
    let dots = 0;
    const updateLoading = () => {
        const loading = "Loading" + ".".repeat(dots);
        User.innerHTML = `<strong>${loading}</strong>`;
        Server.innerHTML = `<strong>${loading}</strong>`;
        dots = (dots + 1) % 4;
    };
    updateLoading();
    return setInterval(updateLoading, 500);
}

async function GetBotInfo() {
    try {
        const res = await fetch("https://bot.shapes.lol/botinfo");
        if (!res.ok) {
            throw new Error("Failed to fetch");
        }
        const data = await res.json();
        Server.innerHTML = `<strong>${data["Servers"] || "Unknown"}</strong>`;
        User.innerHTML = `<strong>${data["Users"] || "Unknown"}</strong>`;
        console.log("Bot Info Fetched:", data);
        return true;
    }
    catch (err) {
        console.error("Error fetching bot info:", err);
        Server.innerHTML = `<strong>Unknown</strong>`;
        User.innerHTML = `<strong>Unknown</strong>`;
        return false;
    }
}

// Start loading animation
const loadingInterval = displayLoadingAnimation();

// Initial fetch
GetBotInfo().then(() => {
    // Clear loading animation once data is fetched
    clearInterval(loadingInterval);
});

// Refresh data every 10 seconds
setInterval(GetBotInfo, 10000);

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

      const topThree = data.slice(0, 3);

      topThree.forEach((server, index) => {
        const card = document.createElement('div');
        card.className = 'leaderboard-card';
        
        const rankClass = `rank-${index + 1}`;
        const rankNum = index + 1;

        card.innerHTML = `
          <div class="card-rank ${rankClass}">#${rankNum}</div>
          <div class="card-server-name">${escapeHtml(server.serverName)}</div>
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
        `;

        container.appendChild(card);

        const currentEl = card.querySelector(`.counter-current-${index}`);
        const highestEl = card.querySelector(`.counter-highest-${index}`);

        animateCounter(currentEl, server.currentnumber);
        animateCounter(highestEl, server.highestnumber);
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
        const leaderboardData = Array.from(data.Leaderboard).map(([, server]) => server);
        displayTopThree(leaderboardData);
      } catch (error) {
        console.error('Failed to fetch leaderboard:', error);
      }
    };

    const fetchStats = async () => {
      try {
        const response = await fetch('https://bot.shapes.lol/stats');
        const data = await response.json();
        
        const usersEl = document.getElementById('users');
        const serversEl = document.getElementById('servers');

        animateCounter(usersEl, data.users || 0);
        animateCounter(serversEl, data.servers || 0);
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      }
    };

    fetchLeaderboard();
    fetchStats();

    setInterval(fetchLeaderboard, 15000);
    setInterval(fetchStats, 30000);