const { Client, Collection, GatewayIntentBits, Partials, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ModalBuilder, TextInputBuilder, TextInputStyle } = require("discord.js");
const config = require("./src/config.js");
const { readdirSync } = require("fs");
const moment = require("moment");
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v10');
const { DisTube } = require('distube');
const { SpotifyPlugin } = require('@distube/spotify');
const { SoundCloudPlugin } = require('@distube/soundcloud');
const { YtDlpPlugin } = require('@distube/yt-dlp');
const db = require("croxydb");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.MessageContent
  ]
});

client.distube = new DisTube(client, {
  leaveOnStop: false,
  leaveOnFinish: false,
  emitNewSongOnly: true,
  emitAddSongWhenCreatingQueue: false,
  emitAddListWhenCreatingQueue: false,
  plugins: [
    new SpotifyPlugin({ 
      emitEventsAfterFetching: true,
      api: {
         clientId: "Spotify id niz",
        clientSecret: "Spotify client id niz",
      }
    }),
    new SoundCloudPlugin(),
    new YtDlpPlugin()
  ],
  savePreviousSongs: true,
  searchSongs: 5,
  customFilters: {
    "bassboost": "bass=g=20,dynaudnorm=f=200",
    "8D": "apulsator=hz=0.08",
    "vaporwave": "aresample=48000,asetrate=48000*0.8",
    "nightcore": "aresample=48000,asetrate=48000*1.25",
    "phaser": "aphaser=in_gain=0.4",
    "tremolo": "tremolo",
    "vibrato": "vibrato=f=6.5",
    "reverse": "areverse",
    "treble": "treble=g=5",
    "normalizer": "dynaudnorm=f=200",
    "surrounding": "surround",
    "pulsator": "apulsator=hz=1",
    "subboost": "asubboost",
    "karaoke": "stereotools=mlev=0.03",
    "flanger": "flanger",
    "gate": "agate",
    "haas": "haas",
    "mcompand": "mcompand"
  }
});

let token = config.token;

client.commands = new Collection();

const rest = new REST({ version: '10' }).setToken(token);

const commands = [];
readdirSync('./src/commands').forEach(async file => {
  const command = require(`./src/commands/${file}`);
  commands.push(command.data.toJSON());
  client.commands.set(command.data.name, command);
});

function createMusicControlButtons1() {
  return new ActionRowBuilder()
    .addComponents(
      new ButtonBuilder().setCustomId('durdur').setEmoji('⏯️').setStyle(ButtonStyle.Primary).setLabel('Duraklat/Devam'),
      new ButtonBuilder().setCustomId('atla').setEmoji('⏭️').setStyle(ButtonStyle.Primary).setLabel('Atla'),
      new ButtonBuilder().setCustomId('tekrarla').setEmoji('🔁').setStyle(ButtonStyle.Secondary).setLabel('Tekrarla'),
      new ButtonBuilder().setCustomId('karistir').setEmoji('🔀').setStyle(ButtonStyle.Secondary).setLabel('Karıştır'),
      new ButtonBuilder().setCustomId('soru').setEmoji('ℹ️').setStyle(ButtonStyle.Secondary).setLabel('Bilgi')
    );
}

function createMusicControlButtons2() {
  return new ActionRowBuilder()
    .addComponents(
      new ButtonBuilder().setCustomId('volume_down').setEmoji('🔉').setStyle(ButtonStyle.Secondary).setLabel('Ses -'),
      new ButtonBuilder().setCustomId('volume_up').setEmoji('🔊').setStyle(ButtonStyle.Secondary).setLabel('Ses +'),
      new ButtonBuilder().setCustomId('filter_reset').setEmoji('🔄').setStyle(ButtonStyle.Danger).setLabel('Sıfırla')
    );
}

function createNowPlayingEmbed(queue, song) {
  const part = Math.floor((queue.currentTime / song.duration) * 30);
  const filters = queue.filters.names.join(', ');
  return new EmbedBuilder()
    .setColor('#FFA500')
    .setTitle('🎵 Şu Anda Çalıyor')
    .setDescription(`**[${song.name}](${song.url})**`)
    .setThumbnail(song.thumbnail)
    .addFields(
      { name: '🎤 Şarkıcı', value: song.uploader.name, inline: true },
      { name: '👤 İsteyen', value: `${song.user}`, inline: true },
      { name: '🔊 Ses Seviyesi', value: `${queue.volume}%`, inline: true },
      { name: '👁️ Görüntülenme', value: `${song.views.toLocaleString()}`, inline: true },
      { name: '👍 Beğeni', value: `${song.likes.toLocaleString()}`, inline: true },
      { name: '🎛️ Filtreler', value: filters || "Yok", inline: true },
      { name: '⏳ İlerleme', value: `\`${queue.formattedCurrentTime} / ${song.formattedDuration}\``, inline: false },
      { name: '\u200B', value: `${'🟠'.repeat(part)}${'⚪'.repeat(30 - part)}`, inline: false }
    )
    .setFooter({ text: `Kuyrukta ${queue.songs.length} şarkı var • Toplam süre: ${queue.formattedDuration} • Kedi için özenle hazırlandı 🐱` })
    .setTimestamp();
}

client.distube
  .on("playSong", (queue, song) => {
    const embed = createNowPlayingEmbed(queue, song);
    const row1 = createMusicControlButtons1();
    const row2 = createMusicControlButtons2();
    queue.textChannel.send({ embeds: [embed], components: [row1, row2] });
  })
  .on("addSong", (queue, song) => {
    const embed = new EmbedBuilder()
      .setColor('#00ff00')
      .setTitle('🎵 Şarkı Kuyruğa Eklendi')
      .setDescription(`**[${song.name}](${song.url})**`)
      .addFields(
        { name: '⏱️ Süre', value: song.formattedDuration, inline: true },
        { name: '👤 İsteyen', value: `${song.user}`, inline: true },
        { name: '🔢 Sıra', value: `${queue.songs.length}`, inline: true }
      )
      .setThumbnail(song.thumbnail)
      .setFooter({ text: 'Kedi için özenle hazırlandı 🐱' });
    queue.textChannel.send({ embeds: [embed] });
  })
  .on("error", (channel, e) => {
    if (channel) channel.send(`Bir hata oluştu: ${e.toString().slice(0, 1974)}`);
    else console.error(e);
  });

client.on("ready", async () => {
  try {
    await rest.put(Routes.applicationCommands(client.user.id), { body: commands });
  } catch (error) {
    console.error(error);
  }
  console.log(`Bot ${client.user.tag} olarak giriş yaptı!`);
  client.user.setActivity('🎵 Müzik | /yardım', { type: 'LISTENING' });
});

client.on("interactionCreate", async interaction => {
  if (!interaction.isCommand()) return;

  const command = client.commands.get(interaction.commandName);
  if (!command) return;

  try {
    await command.run(client, interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply({ content: 'Komutu çalıştırırken bir hata oluştu!', ephemeral: true }).catch(err => {});
  }
});

client.on("interactionCreate", async interaction => {
  if (!interaction.isButton() && !interaction.isModalSubmit()) return;

  const queue = client.distube.getQueue(interaction.guild);
  
  if (!queue && !["yardım", "çal"].includes(interaction.customId)) {
    return interaction.reply({ content: "Şu anda çalan bir şarkı yok.", ephemeral: true }).catch(err => {});
  }

  switch (interaction.customId) {
    case "durdur":
      queue.paused ? queue.resume() : queue.pause();
      interaction.reply({ content: queue.paused ? "⏸️ Müzik duraklatıldı!" : "▶️ Müzik devam ediyor!", ephemeral: true });
      break;
    case "atla":
      if (queue.songs.length > 1) {
        queue.skip();
        interaction.reply({ content: "⏭️ Şarkı atlandı!", ephemeral: true });
      } else {
        interaction.reply({ content: "❗ Kuyrukta başka şarkı yok!", ephemeral: true });
      }
      break;
    case "tekrarla":
      const mode = queue.setRepeatMode((queue.repeatMode + 1) % 3);
      const modeStr = ['Kapalı', 'Şarkı', 'Kuyruk'];
      interaction.reply({ content: `🔁 Tekrar modu: ${modeStr[mode]}`, ephemeral: true });
      break;
    case "karistir":
      if (queue.songs.length > 1) {
        queue.shuffle();
        interaction.reply({ content: "🔀 Kuyruk karıştırıldı!", ephemeral: true });
      } else {
        interaction.reply({ content: "❗ Karıştırmak için kuyrukta birden fazla şarkı olmalı!", ephemeral: true });
      }
      break;
    case "soru":
      const embed = createNowPlayingEmbed(queue, queue.songs[0]);
      interaction.reply({ embeds: [embed], ephemeral: true });
      break;
    case "volume_down":
      adjustVolume(queue, -10, interaction);
      break;
    case "volume_up":
      adjustVolume(queue, 10, interaction);
      break;
    case "bassboost":
      toggleFilter(queue, "bassboost", interaction);
      break;
    case "vaporwave":
      toggleFilter(queue, "vaporwave", interaction);
      break;
    case "filter_reset":
      queue.filters.clear();
      interaction.reply({ content: "🔄 Tüm filtreler sıfırlandı!", ephemeral: true });
      break;
  }
});

function toggleFilter(queue, filter, interaction) {
  const isEnabled = queue.filters.has(filter);
  if (isEnabled) {
    queue.filters.remove(filter);
  } else {
    queue.filters.add(filter);
  }
  interaction.reply({ content: `🎵 ${filter} ${isEnabled ? 'devre dışı bırakıldı' : 'aktifleştirildi'}!`, ephemeral: true });
}

function adjustVolume(queue, change, interaction) {
  const newVolume = Math.max(0, Math.min(100, queue.volume + change));
  queue.setVolume(newVolume);
  interaction.reply({ content: `🔊 Ses seviyesi: ${newVolume}%`, ephemeral: true });
}

client.on('interactionCreate', async interaction => {
  if (!interaction.isModalSubmit()) return;
  
  if (interaction.customId === 'sesAyarı') {
    const sesSeviyesi = interaction.fields.getTextInputValue('sesSeviyesi');
    const volume = parseInt(sesSeviyesi);

    if (isNaN(volume) || volume < 1 || volume > 100) {
      return interaction.reply({ content: "Geçerli bir ses seviyesi girin (1-100 arası).", ephemeral: true }).catch(err => {});
    }

    const queue = client.distube.getQueue(interaction.guild);
    if (!queue) return interaction.reply({ content: "Şu anda çalan bir şarkı yok.", ephemeral: true }).catch(err => {});

    queue.setVolume(volume);
    interaction.reply({ content: `Ses seviyesi ${volume} olarak ayarlandı.`, ephemeral: true }).catch(err => {});
  }
});

process.on('unhandledRejection', error => {
  console.error('Unhandled promise rejection:', error);
});

client.login(token);