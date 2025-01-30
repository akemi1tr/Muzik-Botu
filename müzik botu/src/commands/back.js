const { EmbedBuilder, PermissionsBitField } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const Discord = require("discord.js");
const db = require("croxydb");
const languagefile = require("../language.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("geri")
    .setDescription("🎵 | Şarkıyı geri sar!")
    .addIntegerOption(option => 
      option.setName("saniye")
        .setDescription("Kaç saniye geri gitmek istiyorsunuz?")
        .setRequired(true)
        .setMinValue(1)),
  run: async (client, interaction) => {
    await interaction.deferReply().catch(err => {});
    
    const queue = client.distube.getQueue(interaction);
    if (!queue) return interaction.followUp("Henüz listede şarkı yok.");

    const seconds = interaction.options.getInteger("saniye");

    try {
      const newPosition = Math.max(queue.currentTime - seconds, 0); 
      await queue.seek(newPosition);

      const embed = new EmbedBuilder()
        .setColor("#FFA500")
        .setTitle("⏪ Şarkı Geri Sarıldı")
        .setDescription(`"${queue.songs[0].name}" adlı şarkı ${seconds} saniye geri sarıldı.`)
        .addFields(
          { name: "Şarkı", value: queue.songs[0].name, inline: true },
          { name: "İsteyen", value: queue.songs[0].user.tag, inline: true },
          { name: "Yeni Konum", value: `${Math.floor(newPosition / 60)}:${(newPosition % 60).toString().padStart(2, '0')}`, inline: true }
        )
        .setFooter({ text: "Kedi için özenle hazırlandı 🐱" })
        .setTimestamp();

      return interaction.followUp({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      return interaction.followUp("Şarkıyı geri sararken bir hata oluştu. Lütfen tekrar deneyin.");
    }
  }
};