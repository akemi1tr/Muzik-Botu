const { EmbedBuilder, PermissionsBitField } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const Discord = require("discord.js");
const db = require("croxydb");
const languagefile = require("../language.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("duraklat")
    .setDescription("🎵 | Müziği duraklat!"),
  run: async (client, interaction) => {
    await interaction.deferReply().catch(err => {});
    
    const queue = client.distube.getQueue(interaction);
    if (!queue) return interaction.followUp("Henüz listede şarkı yok.");
    if (queue.paused) return interaction.followUp("Müzik zaten duraklatılmış.");

    try {
      await client.distube.pause(interaction);
      
      const embed = new EmbedBuilder()
        .setColor("#FFA500")
        .setTitle("🎵 Müzik Duraklatıldı")
        .setDescription(`"${queue.songs[0].name}" adlı şarkı duraklatıldı.`)
        .addFields(
          { name: "Şarkı", value: queue.songs[0].name, inline: true },
          { name: "İsteyen", value: queue.songs[0].user.tag, inline: true },
          { name: "Duraklatılan Süre", value: queue.formattedCurrentTime, inline: true }
        )
        .setFooter({ text: "Kedi için özenle hazırlandı 🐱" })
        .setTimestamp();

      interaction.followUp({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      interaction.followUp("Müziği duraklatırken bir hata oluştu. Lütfen tekrar deneyin.");
    }
  }
};