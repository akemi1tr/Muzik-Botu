const { EmbedBuilder, PermissionsBitField } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const Discord = require("discord.js");
const db = require("croxydb");
const languagefile = require("../language.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("🤖 | Botun gecikme süresini gör!"),
  run: async (client, interaction) => {
    await interaction.deferReply().catch(err => {});

    const start = Date.now();
    await interaction.editReply("Ping ölçülüyor...");
    const end = Date.now();

    const embed = new EmbedBuilder()
      .setTitle("🏓 Pong!")
      .addFields(
        { name: "Bot Gecikmesi", value: `${client.ws.ping}ms`, inline: true },
        { name: "API Gecikmesi", value: `${end - start}ms`, inline: true }
      )
      .setColor("Aqua")
      .setFooter({ text: "Kedi için özenle hazırlandı 🐱" })
      .setTimestamp();

    return interaction.editReply({ content: null, embeds: [embed] });
  }
};