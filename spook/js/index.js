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
        leaderboardData = Array.from(data.Leaderboard).map(([, user]) => user);
    } else if (typeof data === 'object' && data !== null) {
        // Handle other object formats
        leaderboardData = Object.values(data);
    }

    const topThree = leaderboardData.slice(0, 3);

    topThree.forEach((user, index) => {
        const card = document.createElement('div');
        card.className = 'leaderboard-card';
        
        const rankClass = `rank-${index + 1}`;
        const rankNum = index + 1;

        card.innerHTML = `
          <div class="card-rank ${rankClass}">#${rankNum}</div>
          <div class="card-content">
            <div class="card-server-name">${escapeHtml(user.UserName || user.name || 'Unknown User')}</div>
            <div class="card-stats">
              <div class="card-stat-row">
                <span class="card-stat-label">Likes</span>
                <span class="card-stat-value counter-likes-${index}">0</span>
              </div>
            </div>
          </div>
        `;

        container.appendChild(card);

        const LikesEl = card.querySelector(`.counter-likes-${index}`);

        animateCounter(LikesEl, user.Likes || user.likes || 0);
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
        const response = await fetch('https://api.spook.bio/profiles');
        const data = await response.json();
        displayTopThree(data);
    } catch (error) {
        console.error('Failed to fetch leaderboard:', error);
    }
};

// Initialize data fetching
console.log('Initializing data fetching');
fetchLeaderboard();

// intervals for updating data
setInterval(fetchLeaderboard, 15000);