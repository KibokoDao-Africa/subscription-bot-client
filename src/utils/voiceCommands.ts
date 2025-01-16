import { SpeechRecognition } from 'web-speech-api';

type VoiceCommandCallback = (command: string) => void;

export const voiceCommands = {
  recognition: null as SpeechRecognition | null,
  synthesis: window.speechSynthesis,
  initialize: () => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      voiceCommands.recognition = new SpeechRecognition();
      voiceCommands.recognition.continuous = true;
      voiceCommands.recognition.interimResults = true;
      voiceCommands.recognition.lang = 'en-US';
    } else {
      console.warn('Speech recognition is not supported in this browser.');
    }
  },
  startListening: (onCommand: VoiceCommandCallback) => {
    if (!voiceCommands.recognition) {
      console.warn('Speech recognition is not initialized.');
      return;
    }
    voiceCommands.recognition.onresult = (event) => {
      const result = event.results[event.results.length - 1];
      if (result.isFinal) {
        const text = result[0].transcript.toLowerCase();
        const command = parseVoiceCommand(text);
        if (command) {
          onCommand(command);
        }
      }
    };
    voiceCommands.recognition.start();
  },
  stopListening: () => {
    if (voiceCommands.recognition) {
      voiceCommands.recognition.stop();
    }
  },
  speak: (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    voiceCommands.synthesis.speak(utterance);
  },
};

const commandPatterns = {
  createChannel: /create (a )?channel|new channel/i,
  deleteChannel: /delete (a )?channel|remove channel/i,
  editChannel: /edit (a )?channel|modify channel/i,
  subscribe: /subscribe to|follow channel/i,
  unsubscribe: /unsubscribe from|leave channel/i,
  addPackage: /add (a )?package|new package/i,
  listChannels: /list channels|show channels/i,
  mainMenu: /main menu|go back|start over/i,
};

const parseVoiceCommand = (text: string): string | null => {
  for (const [action, pattern] of Object.entries(commandPatterns)) {
    if (pattern.test(text)) {
      return action;
    }
  }
  return null;
};

declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
  }
}