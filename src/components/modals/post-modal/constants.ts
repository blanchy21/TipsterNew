export const sports = [
  'American Football',
  'Badminton',
  'Baseball',
  'Basketball',
  'Boxing',
  'Cricket',
  'Cycling',
  'Darts',
  'Esports',
  'Football',
  'Formula 1',
  'Golf',
  'Greyhound Racing',
  'Hockey',
  'Horse Racing',
  'MLB',
  'MMA',
  'MotoGP',
  'NBA',
  'NHL',
  'Rugby',
  'Snooker',
  'Table Tennis',
  'Tennis',
  'Volleyball'
];

export const emojiCategories = {
  sports: ['⚽', '🏀', '🏈', '⚾', '🎾', '🏐', '🏉', '🎱', '🏓', '🏸', '🏒', '🏑', '🏏', '🎯', '🏹', '🎣', '🤸', '🤾', '🏋️', '🚴', '🏇', '🏊', '🏄', '🏃', '🤺', '🥊', '🥋', '🎽', '🏅', '🥇', '🥈', '🥉', '🏆', '🏵️', '🎖️', '🏟️'],
  general: ['😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂', '🙂', '🙃', '😉', '😊', '😇', '🥰', '😍', '🤩', '😘', '😗', '😚', '😙', '😋', '😛', '😜', '🤪', '😝', '🤑', '🤗', '🤭', '🤫', '🤔', '🤐', '🤨', '😐', '😑', '😶', '😏', '😒', '🙄', '😬', '🤥', '😌', '😔', '😪', '🤤', '😴', '😷', '🤒', '🤕', '🤢', '🤮', '🤧', '🥵', '🥶', '🥴', '😵', '🤯', '🤠', '🥳', '😎', '🤓', '🧐', '😕', '😟', '🙁', '☹️', '😮', '😯', '😲', '😳', '🥺', '😦', '😧', '😨', '😰', '😥', '😢', '😭', '😱', '😖', '😣', '😞', '😓', '😩', '😫', '🥱', '😤', '😡', '😠', '🤬', '😈', '👿', '💀', '☠️', '💩', '🤡', '👹', '👺', '👻', '👽', '👾', '🤖', '👍', '👎', '✊', '👊', '🤛', '🤜', '👏', '🙌', '👐', '🤲', '🤝', '🙏', '💪', '🔥', '💯', '⭐', '🌟', '✨'],
  symbols: ['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '💟', '☮️', '✝️', '☪️', '🕉️', '☸️', '✡️', '🔯', '🕎', '☯️', '☦️', '🛐', '⛎', '♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓', '❌', '⭕', '🛑', '⛔', '💯', '💢', '♨️', '🔞', '⭐', '🌟', '💫', '✨', '⚡', '🔥', '💥', '💢', '💨', '💦', '💧', '🌊', '🏁', '🚩', '🎌', '🏴', '🏳️', '🏳️‍🌈'],
  flags: ['🏁', '🚩', '🎌', '🏴', '🏳️', '🏳️‍🌈', '🏳️‍⚧️', '🏴‍☠️', '🇦🇺', '🇧🇷', '🇨🇦', '🇩🇪', '🇪🇸', '🇫🇷', '🇬🇧', '🇮🇪', '🇮🇳', '🇮🇹', '🇯🇵', '🇰🇷', '🇲🇽', '🇳🇱', '🇵🇹', '🇷🇺', '🇺🇸', '🇿🇦']
};

export interface FallbackGif {
  id: string;
  title: string;
  images: {
    fixed_height: { url: string };
    fixed_height_small: { url: string };
  };
}

export const fallbackGifs: FallbackGif[] = [
  {
    id: 'happy-1',
    title: 'Happy',
    images: {
      fixed_height: { url: 'https://media.giphy.com/media/3o7btPCcdNniyf0ArS/giphy.gif' },
      fixed_height_small: { url: 'https://media.giphy.com/media/3o7btPCcdNniyf0ArS/100.gif' }
    }
  },
  {
    id: 'excited-1',
    title: 'Excited',
    images: {
      fixed_height: { url: 'https://media.giphy.com/media/26ufdipQqU2lhNA4g/giphy.gif' },
      fixed_height_small: { url: 'https://media.giphy.com/media/26ufdipQqU2lhNA4g/100.gif' }
    }
  },
  {
    id: 'celebration-1',
    title: 'Celebration',
    images: {
      fixed_height: { url: 'https://media.giphy.com/media/3o6Zt4HUhqJqJqJqJq/giphy.gif' },
      fixed_height_small: { url: 'https://media.giphy.com/media/3o6Zt4HUhqJqJqJqJq/100.gif' }
    }
  },
  {
    id: 'sports-1',
    title: 'Sports',
    images: {
      fixed_height: { url: 'https://media.giphy.com/media/l0MYt5jPR6QX5pnqM/giphy.gif' },
      fixed_height_small: { url: 'https://media.giphy.com/media/l0MYt5jPR6QX5pnqM/100.gif' }
    }
  },
  {
    id: 'win-1',
    title: 'Win',
    images: {
      fixed_height: { url: 'https://media.giphy.com/media/3o7btPCcdNniyf0ArS/giphy.gif' },
      fixed_height_small: { url: 'https://media.giphy.com/media/3o7btPCcdNniyf0ArS/100.gif' }
    }
  },
  {
    id: 'victory-1',
    title: 'Victory',
    images: {
      fixed_height: { url: 'https://media.giphy.com/media/26ufdipQqU2lhNA4g/giphy.gif' },
      fixed_height_small: { url: 'https://media.giphy.com/media/26ufdipQqU2lhNA4g/100.gif' }
    }
  },
  {
    id: 'football-1',
    title: 'Football',
    images: {
      fixed_height: { url: 'https://media.giphy.com/media/l0MYt5jPR6QX5pnqM/giphy.gif' },
      fixed_height_small: { url: 'https://media.giphy.com/media/l0MYt5jPR6QX5pnqM/100.gif' }
    }
  },
  {
    id: 'basketball-1',
    title: 'Basketball',
    images: {
      fixed_height: { url: 'https://media.giphy.com/media/3o7btPCcdNniyf0ArS/giphy.gif' },
      fixed_height_small: { url: 'https://media.giphy.com/media/3o7btPCcdNniyf0ArS/100.gif' }
    }
  },
  {
    id: 'success-1',
    title: 'Success',
    images: {
      fixed_height: { url: 'https://media.giphy.com/media/26ufdipQqU2lhNA4g/giphy.gif' },
      fixed_height_small: { url: 'https://media.giphy.com/media/26ufdipQqU2lhNA4g/100.gif' }
    }
  },
  {
    id: 'thumbs-up-1',
    title: 'Thumbs Up',
    images: {
      fixed_height: { url: 'https://media.giphy.com/media/3o6Zt4HUhqJqJqJqJq/giphy.gif' },
      fixed_height_small: { url: 'https://media.giphy.com/media/3o6Zt4HUhqJqJqJqJq/100.gif' }
    }
  }
];
