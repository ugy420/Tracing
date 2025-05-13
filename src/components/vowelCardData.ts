type CardItem = {
  id: string;
  text: string;
  backgroundColor: any;
  screen: 'Tracing';
};

const CardBgColors = [
  'rgb(83, 213, 230)',
  'rgb(234, 216, 103)',
  'rgb(237, 135, 203)',
  'rgb(69, 173, 224)',
  'rgb(143, 105, 208)',
];

export const cardVowelData: CardItem[] = [
  {
    id: '1',
    text: 'ི',
    backgroundColor: CardBgColors[0],
    screen: 'Tracing',
  },
  {
    id: '2',
    text: 'ུ',
    backgroundColor: CardBgColors[1],
    screen: 'Tracing',
  },
  {
    id: '3',
    text: 'ེ',
    backgroundColor: CardBgColors[2],
    screen: 'Tracing',
  },
  {
    id: '4',
    text: 'ོ',
    backgroundColor: CardBgColors[3],
    screen: 'Tracing',
  },
];
