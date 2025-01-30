const { EmbedBuilder, PermissionsBitField } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const Discord = require("discord.js");
const db = require("croxydb");
const languagefile = require("../language.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("çalan")
    .setDescription("🎵 | Şu an çalan şarkı hakkında bilgi al."),
  run: async (client, interaction) => {
    await interaction.deferReply().catch(err => {});
    
    const queue = client.distube.getQueue(interaction);
    if (!queue) return interaction.followUp("Henüz listede şarkı yok.");

    try {
      const song = queue.songs[0];
      const part = Math.floor((queue.currentTime / song.duration) * 20);
      
      const embed = new EmbedBuilder()
        .setColor('Purple')
        .setTitle("🎵 Şu An Çalıyor")
        .setDescription(`**[${song.name}](${song.url})**`)
        .setThumbnail(song.thumbnail)
        .addFields(
          { name: 'Şarkıcı:', value: `[${song.uploader.name}](${song.uploader.url})`, inline: true },
          { name: 'İsteyen:', value: `${song.user}`, inline: true },
          { name: 'Ses Seviyesi:', value: `${queue.volume}%`, inline: true },
          { name: 'Görüntülenme:', value: `${song.views}`, inline: true },
          { name: 'Beğeni:', value: `${song.likes}`, inline: true },
          { name: 'Filtreler:', value: `${queue.filters.names.join(', ') || "Normal"}`, inline: true },
          { name: `Süre: [${queue.formattedCurrentTime} / ${song.formattedDuration}]`, value: `${'🟣'.repeat(part)}🎵${'⚪'.repeat(20 - part)}`, inline: false }
        )
        .setFooter({ text: "Kedi için özenle hazırlandı 🐱" })
        .setTimestamp();

      return interaction.followUp({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      return interaction.followUp("Şarkı bilgilerini alırken bir hata oluştu. Lütfen tekrar deneyin.");
    }
  }
};