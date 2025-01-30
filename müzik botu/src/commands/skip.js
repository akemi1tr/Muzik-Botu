const { EmbedBuilder, PermissionsBitField } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const Discord = require("discord.js");
const db = require("croxydb");
const languagefile = require("../language.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("atla")
    .setDescription("🎵 | Şarkıyı atla!"),

  run: async (client, interaction) => {
    await interaction.deferReply().catch(err => {});
    
    const queue = client.distube.getQueue(interaction);
    if (!queue) return interaction.followUp("Henüz listede şarkı yok.");
    if (queue.songs.length === 1) return interaction.followUp("Sırada başka şarkı yok!");

    try {
      const skippedSong = queue.songs[0];
      await client.distube.skip(interaction);

      const embed = new EmbedBuilder()
        .setColor("#ff9900")
        .setTitle("🎵 Şarkı Atlandı")
        .setDescription(`"${skippedSong.name}" adlı şarkı başarıyla atlandı.`)
        .addFields(
          { name: "Atlanan Şarkı", value: skippedSong.name, inline: true },
          { name: "İsteyen", value: skippedSong.user.tag, inline: true }
        )
        .setFooter({ text: "Kedi için özenle hazırlandı 🐱" })
        .setTimestamp();

      if (queue.songs[0]) {
        embed.addFields({ name: "Sıradaki Şarkı", value: queue.songs[0].name, inline: false });
      }

      interaction.followUp({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      interaction.followUp("Şarkıyı atlarken bir hata oluştu. Lütfen tekrar deneyin.");
    }
  }
};