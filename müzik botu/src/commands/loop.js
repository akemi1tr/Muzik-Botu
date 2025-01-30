const { EmbedBuilder, PermissionsBitField } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const Discord = require("discord.js");
const db = require("croxydb");
const languagefile = require("../language.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("döngü")
    .setDescription("🎵 | Şarkıyı döngüye al!"),
  run: async (client, interaction) => {
    await interaction.deferReply().catch(err => {});
    
    const queue = client.distube.getQueue(interaction);
    if (!queue) return interaction.followUp("Henüz listede şarkı yok.");

    try {
      const mode = client.distube.setRepeatMode(interaction, 1);
      const embed = new EmbedBuilder()
        .setColor("#00FF00")
        .setTitle("🔁 Şarkı Döngüye Alındı")
        .setDescription(`"${queue.songs[0].name}" adlı şarkı başarıyla döngüye alındı.`)
        .addFields(
          { name: "Şarkı", value: queue.songs[0].name, inline: true },
          { name: "İsteyen", value: queue.songs[0].user.tag, inline: true },
          { name: "Döngü Modu", value: mode ? "Açık" : "Kapalı", inline: true }
        )
        .setFooter({ text: "Kedi için özenle hazırlandı 🐱" })
        .setTimestamp();

      return interaction.followUp({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      return interaction.followUp("Şarkıyı döngüye alırken bir hata oluştu. Lütfen tekrar deneyin.");
    }
  }
};