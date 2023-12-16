const { SlashCommandBuilder } = require("discord.js");

function slotMachine() {
    const symbols = ['🍒', '🍋', '🍇', '🍊', '🍉'];
    const reels = [symbols[Math.floor(Math.random() * symbols.length)], symbols[Math.floor(Math.random() * symbols.length)], symbols[Math.floor(Math.random() * symbols.length)]];
  
    let message = 'Slot Machine Result:\n';
    message += reels.join(' | ');
  
    if (reels[0] === reels[1] && reels[1] === reels[2]) {
      message += '\nCongratulations! You won 100 coins!';
      return { coins: 100, message };
    } else {
      message += '\nSorry, you lost. Try again!';
      return { coins: 0, message };
    }
  }
  
  module.exports = { slotMachine };