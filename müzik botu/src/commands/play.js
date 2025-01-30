const { SlashCommandBuilder } = require("@discordjs/builders");
const db = require("croxydb");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("çal")
    .setDescription("🎵 | Müzik çal!")
    .addStringOption(option => 
      option.setName("sarkı")
        .setDescription("Şarkı adı veya URL'si?")
        .setRequired(true)),

  run: async (client, interaction) => {
    await interaction.deferReply().catch(err => {});
    
    const string = interaction.options.getString("sarkı");
    let voiceChannel = interaction.member.voice.channel;
    if (!voiceChannel) return interaction.followUp("Bir ses kanalında değilsiniz!");

    try {
      await client.distube.play(voiceChannel, string, {
        member: interaction.member,
        textChannel: interaction.channel,
        interaction
      });

      interaction.followUp("🎵 Şarkı başarıyla eklendi! Detaylar birazdan görüntülenecek.");

    } catch (error) {
      console.error(error);
      interaction.followUp("Şarkıyı çalarken bir hata oluştu. Lütfen tekrar deneyin.");
    }
  }
};