const { EmbedBuilder, PermissionsBitField } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const Discord = require("discord.js");
const db = require("croxydb");
const languagefile = require("../language.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ilerlet")
    .setDescription("🎵 | Şarkıyı ilerlet!")
    .addIntegerOption(option => 
      option.setName("saniye")
        .setDescription("Kaç saniye ilerletmek istiyorsunuz?")
        .setRequired(true)
        .setMinValue(1)),

  run: async (client, interaction) => {
    await interaction.deferReply().catch(err => {});
    
    const queue = client.distube.getQueue(interaction);
    if (!queue) return interaction.followUp("Henüz listede şarkı yok.");

    const seconds = interaction.options.getInteger("saniye");

    try {
      const newPosition = queue.currentTime + seconds;
      await queue.seek(newPosition);

      const embed = new EmbedBuilder()
        .setColor("#00ff00")
        .setTitle("🎵 Şarkı İlerletildi")
        .setDescription(`Şarkı ${seconds} saniye ilerletildi.`)
        .addFields(
          { name: "Şarkı", value: queue.songs[0].name, inline: true },
          { name: "Yeni Konum", value: `${Math.floor(newPosition / 60)}:${(newPosition % 60).toString().padStart(2, '0')}`, inline: true }
        )
        .setFooter({ text: "Kedi için özenle hazırlandı 🐱" })
        .setTimestamp();

      interaction.followUp({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      interaction.followUp("Şarkıyı ilerletirken bir hata oluştu. Lütfen tekrar deneyin.");
    }
  }
};