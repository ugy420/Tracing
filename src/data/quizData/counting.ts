type questionItem = {
  question: string;
  options: string[];
  correctAnswer: string;
  image: any;
};

export const countingQuizData: questionItem[] = [
  {
    question: 'དེ་ཁར་ སེང་གེ་ ག་དེམ་ཅིག་འདུག?',
    options: ['1', '2', '3', '4'],
    correctAnswer: '2',
    image: require('../../assets/numbers/lion.png'),
  },
  {
    question: 'དེ་ཁར་ པི་སི་ ག་དེམ་ཅིག་འདུག?',
    options: ['6', '7', '8', '9'],
    correctAnswer: '8',
    image: require('../../assets/numbers/pencil.png'),
  },
  {
    question: 'དེ་ཁར་ ཉིམ་གང་ཤར་མེ་ཏོག་ ག་དེམ་ཅིག་འདུག?',
    options: ['4', '5', '6', '7'],
    correctAnswer: '4',
    image: require('../../assets/numbers/sunflower.png'),
  },
  {
    question: 'དེ་ཁར་ བྱ་པོད་ ག་དེམ་ཅིག་འདུག?',
    options: ['5', '6', '2', '3'],
    correctAnswer: '6',
    image: require('../../assets/numbers/rooster.png'),
  },
  {
    question: 'དེ་ཁར་ བྱ་པོད་ ག་དེམ་ཅིག་འདུག?',
    options: ['0', '1', '5', '3'],
    correctAnswer: '3',
    image: require('../../assets/numbers/bees.png'),
  },
];
