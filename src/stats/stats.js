export function initializeStats() {
    const storedStats = JSON.parse(localStorage.getItem("playerStats") || "[]");
    const defaultPlayerStats = [
        { userName: "agent007@gmail.com", displayName: "Agent007", wins: 7, losses: 2 },
        { userName: "coolguy123@gmail.com", displayName: "Cool Guy", wins: 2, losses: 10 },
    ];

    const seededStats = [...storedStats];
    for (const defaultPlayer of defaultPlayerStats) {
        if (!seededStats.some((player) => player.userName === defaultPlayer.userName)) {
        seededStats.push(defaultPlayer);
        }
    }
    localStorage.setItem("playerStats", JSON.stringify(seededStats));
}