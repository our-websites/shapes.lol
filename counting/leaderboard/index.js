async function fetchLeaderboard() {
            try {
                const response = await fetch('https://bot.shapes.lol/clb');
                const data = await response.json();
                const tbody = document.getElementById('leaderboard').getElementsByTagName('tbody')[0];
                tbody.innerHTML = ''; // Clear existing data
                for (const server of data["Leaderboard"]) {
                    console.log(server);
                    const row = document.createElement('tr');
                    const serverCell = document.createElement('td');
                    const numberCell = document.createElement('td');

                    serverCell.textContent = server[1]['serverName'];
                    numberCell.textContent = server[1]['highestnumber'];

                    row.appendChild(serverCell);
                    row.appendChild(numberCell);
                    tbody.appendChild(row);
                }
            } catch (error) {
                console.error('Error fetching leaderboard data:', error);
            }
        }

        // Fetch leaderboard data every 10 seconds
        fetchLeaderboard();
        setInterval(fetchLeaderboard, 10000);
