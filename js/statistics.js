document.addEventListener('DOMContentLoaded', () => {
    const weeklyStatsDiv = document.getElementById('weekly-stats');
    const vibeStatsTable = document.getElementById('vibe-stats');

    function calculateStats() {
        const results = JSON.parse(localStorage.getItem('quizResults') || '[]');
        
        if (results.length === 0) {
            weeklyStatsDiv.innerHTML = '<p>Pole veel piisavalt andmeid statistika jaoks.</p>';
            return;
        }

        // Get results from the last 7 days
        const now = new Date();
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        
        const weeklyResults = results.filter(result => 
            new Date(result.timestamp) > weekAgo
        );

        // Calculate averages for each type
        const totalStats = {
            student: 0,
            zombie: 0,
            guru: 0,
            coffee: 0
        };

        weeklyResults.forEach(result => {
            result.results.forEach(typeResult => {
                totalStats[typeResult.type] += typeResult.percentage;
            });
        });

        // Convert to averages
        Object.keys(totalStats).forEach(type => {
            totalStats[type] = Math.round(totalStats[type] / weeklyResults.length);
        });

        // Display weekly stats
        weeklyStatsDiv.innerHTML = `
            <p>Viimase 7 päeva keskmine:</p>
            <ul>
                ${Object.entries(totalStats)
                    .sort(([,a], [,b]) => b - a)
                    .map(([type, percentage]) => `
                        <li>${getTypeName(type)}: ${percentage}%</li>
                    `).join('')}
            </ul>
        `;

        // Update vibe stats table
        vibeStatsTable.innerHTML = `
            <tr>
                <th>Vibe Tüüp</th>
                <th>Keskmine %</th>
            </tr>
            ${Object.entries(totalStats)
                .sort(([,a], [,b]) => b - a)
                .map(([type, percentage]) => `
                    <tr>
                        <td>${getTypeName(type)}</td>
                        <td>${percentage}%</td>
                    </tr>
                `).join('')}
        `;
    }

    function getTypeName(type) {
        const types = {
            student: "Tartu Tudeng",
            zombie: "Zombie Tudeng",
            guru: "Õppur-Guru",
            coffee: "Kohvimasinaga Sõltlane"
        };
        return types[type] || type;
    }

    // Initial calculation
    calculateStats();
});