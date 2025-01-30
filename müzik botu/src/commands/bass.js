const { EmbedBuilder, PermissionsBitField } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const Discord = require("discord.js");
const db = require("croxydb");
const languagefile = require("../language.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("bassguclendir")
    .setDescription("🎵 | Bass güçlendirme efekti uygula"),
  run: async (client, interaction) => {
    await interaction.deferReply().catch(err => {});
    
    const queue = client.distube.getQueue(interaction);
    if (!queue) return interaction.followUp("Henüz listede şarkı yok.");

    try {
      queue.filters.add("bassboost");

      const embed = new EmbedBuilder()
        .setColor("#8A2BE2")
        .setTitle("🥁 Bass Güçlendirildi")
        .setDescription(`"${queue.songs[0].name}" adlı şarkıya bass güçlendirme efekti uygulandı.`)
        .addFields(
          { name: "Şarkı", value: queue.songs[0].name, inline: true },
          { name: "İsteyen", value: queue.songs[0].user.tag, inline: true },
          { name: "Efekt", value: "Bass Güçlendirme", inline: true }
        )
        .setFooter({ text: "Kedi için özenle hazırlandı 🐱" })
        .setTimestamp();

      return interaction.followUp({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      return interaction.followUp("Bass güçlendirme efekti uygulanırken bir hata oluştu. Lütfen tekrar deneyin.");
    }
  }
};