const { EmbedBuilder, PermissionsBitField } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const Discord = require("discord.js")
const db = require("croxydb")
const languagefile = require("../language.json")

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ses")
    .setDescription("🎵 | Müzik ses seviyesini ayarla!")
    .addIntegerOption(option => 
      option.setName("seviye")
        .setDescription("1-100 arası bir değer girin")
        .setRequired(true)
        .setMinValue(1)
        .setMaxValue(100)),
    run: async (client, interaction) => {
      await interaction.deferReply()
      const volume = interaction.options.getInteger("seviye")
      const language = db.fetch(`language_${interaction.user.id}`)
      
      const queue = client.distube.getQueue(interaction);
      if (!queue) return interaction.followUp(`Henüz listede şarkı yok.`)
      
      client.distube.setVolume(interaction, volume);
      
      const embed = new Discord.EmbedBuilder()
        .setColor('#00ff00')
        .setTitle('Ses Seviyesi Ayarlandı')
        .setDescription(`Müziğin ses seviyesi başarıyla **${volume}** olarak ayarlandı.`)
        .setFooter({text: 'Kedi için özenle hazırlandı 🐱'})
        .setTimestamp()
      
      interaction.followUp({embeds: [embed]})
    }
}