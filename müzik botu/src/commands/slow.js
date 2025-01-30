const { EmbedBuilder, PermissionsBitField } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const Discord = require("discord.js");
const db = require("croxydb");
const languagefile = require("../language.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("yavaslat")
    .setDescription("🎵 | Müziği yavaşlat!")
    .addIntegerOption(option => 
      option.setName("oran")
        .setDescription("Yavaşlatma oranı (50-99)")
        .setRequired(false)
        .setMinValue(50)
        .setMaxValue(99)),

  run: async (client, interaction) => {
    await interaction.deferReply().catch(err => {});
    
    const queue = client.distube.getQueue(interaction);
    if (!queue) return interaction.followUp("Henüz listede şarkı yok.");

    const slowRate = interaction.options.getInteger("oran") || 75; // Varsayılan 75% bunu öneririm  size kalmış genede

    try {
      queue.filters.add("vaporwave");
      queue.setFilter("vaporwave", { rate: slowRate / 100 });

      const embed = new EmbedBuilder()
        .setColor("#0099ff")
        .setTitle("🎵 Müzik Yavaşlatıldı")
        .setDescription(`Şarkı başarıyla %${slowRate} oranında yavaşlatıldı.`)
        .addFields(
          { name: "Şarkı", value: queue.songs[0].name, inline: true },
          { name: "Yavaşlatma Oranı", value: `%${slowRate}`, inline: true }
        )
        .setFooter({ text: "Kedi için özenle hazırlandı 🐱" })
        .setTimestamp();

      interaction.followUp({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      interaction.followUp("Müziği yavaşlatırken bir hata oluştu. Lütfen tekrar deneyin.");
    }
  }
};