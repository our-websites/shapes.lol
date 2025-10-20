const leaderboardContainer = document.getElementById('leaderboard');

async function fetchLeaderboard() {
    try {
        const response = await fetch('https://bot.shapes.lol/clb');
        const data = await response.json();
        displayLeaderboard(data);
    } catch (error) {
        console.error('Error fetching leaderboard:', error);
    }
}

function displayLeaderboard(users) {
    const table = document.createElement('div');
    table.style.display = 'table';
    table.style.width = '100%';
    table.style.borderCollapse = 'collapse';

    const headerRow = document.createElement('div');
    headerRow.style.display = 'table-row';
    headerRow.style.fontWeight = 'bold';
    const usernameHeader = createCell('Username');
    const scoreHeader = createCell('Score');
    headerRow.appendChild(usernameHeader);
    headerRow.appendChild(scoreHeader);
    table.appendChild(headerRow);

    users.forEach(user => {
        const row = document.createElement('div');
        row.style.display = 'table-row';
        const usernameCell = createCell(user.username);
        const scoreCell = createCell(user.score);
        row.appendChild(usernameCell);
        row.appendChild(scoreCell);
        table.appendChild(row);
    });

    leaderboardContainer.appendChild(table);
}

function createCell(content) {
    const cell = document.createElement('div');
    cell.style.display = 'table-cell';
    cell.style.border = '1px solid #ddd';
    cell.style.padding = '8px';
    cell.textContent = content;
    return cell;
}

fetchLeaderboard();
setInterval(fetchLeaderboard, 60000); // Refresh every 60 seconds
