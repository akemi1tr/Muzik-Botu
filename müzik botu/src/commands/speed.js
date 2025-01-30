const { EmbedBuilder, PermissionsBitField } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const Discord = require("discord.js");
const db = require("croxydb");
const languagefile = require("../language.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("hizlandir")
    .setDescription("🎵 | Müziği hızlandır!")
    .addIntegerOption(option => 
      option.setName("oran")
        .setDescription("Hızlandırma oranı (100-300)")
        .setRequired(false)
        .setMinValue(100)
        .setMaxValue(300)),

  run: async (client, interaction) => {
    await interaction.deferReply().catch(err => {});
    
    const queue = client.distube.getQueue(interaction);
    if (!queue) return interaction.followUp("Henüz listede şarkı yok.");

    const speedRate = interaction.options.getInteger("oran") || 150; 

    try {
      queue.filters.add("nightcore");
      queue.setFilter("nightcore", { rate: speedRate / 100 });

      const embed = new EmbedBuilder()
        .setColor("#00ff00")
        .setTitle("🎵 Müzik Hızlandırıldı")
        .setDescription(`Şarkı başarıyla %${speedRate} oranında hızlandırıldı.`)
        .addFields(
          { name: "Şarkı", value: queue.songs[0].name, inline: true },
          { name: "Hızlandırma Oranı", value: `%${speedRate}`, inline: true }
        )
        .setFooter({ text: "Kedi için özenle hazırlandı 🐱" })
        .setTimestamp();

      interaction.followUp({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      interaction.followUp("Müziği hızlandırırken bir hata oluştu. Lütfen tekrar deneyin.");
    }
  }
};