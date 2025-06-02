type questionItem = {
  questionDzo: string;
  questionEng: string;
  options: string[];
  correctAnswer: string;
  image: any;
};

export const countingQuizData: questionItem[] = [
  {
    questionDzo: 'དེ་ཁར་ སེང་གེ་ ག་དེམ་ཅིག་འདུག?',
    questionEng: 'How many lions do you see?',
    options: ['1', '2', '3', '4'],
    correctAnswer: '2',
    image: require('../../assets/numbers/lion.png'),
  },
  {
    questionDzo: 'དེ་ཁར་ པི་སི་ ག་དེམ་ཅིག་འདུག?',
    questionEng: 'How many pencils do you see?',
    options: ['6', '7', '8', '9'],
    correctAnswer: '8',
    image: require('../../assets/numbers/pencil.png'),
  },
  {
    questionDzo: 'དེ་ཁར་ ཉིམ་གང་ཤར་མེ་ཏོག་ ག་དེམ་ཅིག་འདུག?',
    questionEng: 'How many sunflowers do you see?',
    options: ['4', '5', '6', '7'],
    correctAnswer: '4',
    image: require('../../assets/numbers/sunflower.png'),
  },
  {
    questionDzo: 'དེ་ཁར་ བྱ་པོད་ ག་དེམ་ཅིག་འདུག?',
    questionEng: 'How many cocks do you see?',
    options: ['5', '6', '2', '3'],
    correctAnswer: '6',
    image: require('../../assets/numbers/rooster.png'),
  },
  {
    questionDzo: 'དེ་ཁར་ བྱ་པོད་ ག་དེམ་ཅིག་འདུག?',
    questionEng: 'How many bees do you see?',
    options: ['0', '1', '5', '3'],
    correctAnswer: '3',
    image: require('../../assets/numbers/bees.png'),
  },
];
