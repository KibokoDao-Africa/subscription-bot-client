import { Telegraf } from 'telegraf';

export class TelegramBotService {
  private bot: Telegraf;
  private static instance: TelegramBotService;

  private constructor() {
    this.bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN || '');
    this.initializeCommands();
  }

  static getInstance(): TelegramBotService {
    if (!TelegramBotService.instance) {
      TelegramBotService.instance = new TelegramBotService();
    }
    return TelegramBotService.instance;
  }

  private initializeCommands() {
    this.bot.command('start', (ctx) => {
      ctx.reply('Welcome to Subscription Bot! 🎉\n\nUse these commands:\n' +
        '/channels - Manage your channels\n' +
        '/subscribe - Subscribe to channels\n' +
        '/mysubs - View your subscriptions\n' +
        '/help - Get help');
    });

    this.bot.command('channels', (ctx) => {
      ctx.reply('Channel Management:\n' +
        '📢 Use these commands:\n\n' +
        '/createchannel - Create a new channel\n' +
        '/listchannels - View your channels\n' +
        '/editchannel - Edit a channel\n' +
        '/addpackage - Add subscription package');
    });

    this.bot.command('subscribe', async (ctx) => {
      const channels = await this.getAvailableChannels();
      ctx.reply('Available Channels:\n\n' + 
        channels.map(c => `${c.name} - /sub_${c.id}`).join('\n'));
    });

    this.bot.command('mysubs', async (ctx) => {
      const subs = await this.getUserSubscriptions(ctx.from?.id);
      ctx.reply('Your Active Subscriptions:\n\n' +
        subs.map(s => `${s.channelName} - Expires: ${s.endDate}\n/unsub_${s.id}`).join('\n'));
    });

    this.bot.command('help', (ctx) => {
      ctx.reply('Voice Commands:\n' +
        '🎙 You can use these voice commands:\n\n' +
        '"Create channel"\n' +
        '"Subscribe to channel"\n' +
        '"Show my subscriptions"\n' +
        '"Delete channel"\n' +
        '"Add package"\n\n' +
        'Or use the menu commands above 👆');
    });

    this.bot.action(/sub_(.+)/, (ctx) => {
      const channelId = ctx.match[1];
      // Handle subscription process
    });

    this.bot.action(/unsub_(.+)/, (ctx) => {
      const subId = ctx.match[1];
      // Handle unsubscription process
    });
  }

  private async getAvailableChannels() {
    return [];
  }

  private async getUserSubscriptions(userId?: number) {
    return [];
  }

  public async startBot() {
    try {
      await this.bot.launch();
      console.log('Bot started successfully');
    } catch (error) {
      console.error('Error starting bot:', error);
    }
  }

  public async addBotToChannel(channelUrl: string) {
    try {
      await this.bot.telegram.getChatAdministrators(channelUrl);
      this.bot.use(async (ctx, next) => {
        if (ctx.chat?.type === 'channel') {
          const hasActiveSubscription = await this.checkSubscription(ctx.chat.id);
          if (!hasActiveSubscription) {
            await ctx.reply(
              "⚠️ This channel requires an active subscription.\n" +
              "Use /subscribe to view available packages!"
            );
            return;
          }
        }
        return next();
      });
    } catch (error) {
      console.error("Error adding bot to channel:", error);
      throw error;
    }
  }

  public async sendChannelMessage(channelUrl: string, message: string) {
    try {
      await this.bot.telegram.sendMessage(channelUrl, message);
    } catch (error) {
      console.error("Error sending channel message:", error);
      throw error;
    }
  }

  private async checkSubscription(chatId: number): Promise<boolean> {
    return true;
  }
}