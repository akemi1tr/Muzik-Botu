const { ActivityType } = require("discord.js");

module.exports = {
    name: 'ready',
    once: true,
    execute(client) {
        console.log(`${client.user.tag} olarak giriş yapıldı!`);

        let activityIndex = 0;
        const activities = [
            { name: "🎵 | Kedi için özenle yapıldı", type: ActivityType.Listening },
            { name: "😼 | Kedi var ne bakıyon", type: ActivityType.Playing }
        ];

        setInterval(() => {
            const activity = activities[activityIndex];
            client.user.setActivity(activity.name, { type: activity.type });

            activityIndex = (activityIndex + 1) % activities.length;
        }, 10000); // 10 saniyede bir değişir
    }
};