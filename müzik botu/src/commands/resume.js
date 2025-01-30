const { EmbedBuilder, PermissionsBitField } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const Discord = require("discord.js");
const db = require("croxydb");
const languagefile = require("../language.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("devamet")
    .setDescription("🎵 | Duraklatılmış müziği devam ettir!"),

  run: async (client, interaction) => {
    await interaction.deferReply().catch(err => {});
    
    const queue = client.distube.getQueue(interaction);
    if (!queue) return interaction.followUp("Henüz listede şarkı yok.");
    if (!queue.paused) return interaction.followUp("Müzik zaten çalıyor.");

    try {
      await queue.resume();

      const embed = new EmbedBuilder()
        .setColor("#00ff00")
        .setTitle("🎵 Müzik Devam Ediyor")
        .setDescription(`"${queue.songs[0].name}" adlı şarkı tekrar çalmaya başladı.`)
        .addFields(
          { name: "Şarkı", value: queue.songs[0].name, inline: true },
          { name: "İsteyen", value: queue.songs[0].user.tag, inline: true }
        )
        .setFooter({ text: "Kedi için özenle hazırlandı 🐱" })
        .setTimestamp();

      interaction.followUp({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      interaction.followUp("Müziği devam ettirirken bir hata oluştu. Lütfen tekrar deneyin.");
    }
  }
};