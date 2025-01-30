const { EmbedBuilder, PermissionsBitField } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const Discord = require("discord.js");
const db = require("croxydb");
const languagefile = require("../language.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ayrıl")
    .setDescription("🎵 | Ses kanalından ayrıl ve müziği bitir!"),
  run: async (client, interaction) => {
    await interaction.deferReply().catch(err => {});
    
    const queue = client.distube.getQueue(interaction);
    if (!queue) return interaction.followUp("Henüz listede şarkı yok.");

    try {
      await client.distube.voices.leave(interaction);
      db.delete(`music_${interaction.guild.id}`);

      const embed = new EmbedBuilder()
        .setColor("#FF0000")
        .setTitle("👋 Ses Kanalından Ayrıldım")
        .setDescription("Müzik çalma işlemi sonlandırıldı ve ses kanalından ayrıldım.")
        .setFooter({ text: "Kedi için özenle hazırlandı 🐱" })
        .setTimestamp();

      return interaction.followUp({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      return interaction.followUp("Ses kanalından ayrılırken bir hata oluştu. Lütfen tekrar deneyin.");
    }
  }
};