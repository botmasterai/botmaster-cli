import { BaseBot } from 'botmaster';

export class TestBot extends BaseBot {
  constructor(settings) {
    super(settings);

    this.type = 'test';
    this.requiredCredentials = [];

    this.receives = {
      text: false,
      attachments: {
        audio: false,
        file: false,
        image: false,
        video: false,
      },
      echo: false,
      read: false,
      postbacks: false,
    };

    this.sends = {
      text: false,
      quickReply: false,
      typing: false,
      attachments: {
        audio: false,
        file: false,
        image: false,
        video: false,
      },
    };

    // make sure your bot is assigned an id at the latest upon receiving a message
    // and before emitting that message to botmaster
    this.id = '';

    this.__applySettings(settings);
  }

  __formatUpdate(rawUpdate) {
  }

  __formatOutgoingMessage(message) {
  }

  __sendMessage(message) {
  }

  sendRaw(message, cb) {
  }
}
