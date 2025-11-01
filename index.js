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

      const topThree = data.slice(0, 3);

      topThree.forEach((server, index) => {
        const card = document.createElement('div');
        card.className = 'leaderboard-card';
        
        const rankClass = `rank-${index + 1}`;
        const rankNum = index + 1;

        card.innerHTML = `
          <div class="card-rank ${rankClass}">#${rankNum}</div>
          <div class="card-content">
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