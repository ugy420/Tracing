export type questionItem = {
  questionDzo: string;
  questionEng: string;
  options: string[];
  correctAnswer: string;
  image: any;
};

export const animalsQuizData: questionItem[] = [
  {
    questionDzo: 'གཤམ་གྱི་དཔེ་རིས་ལས ཡིག་འབྲུ་ག་འདི་འགོ་བཙུགསཔ་སྨོ?',
    questionEng: 'From the picture below, which letter does it start with?',
    options: ['པ', 'ཕ', 'བ', 'མ'],
    correctAnswer: 'ཕ',
    image: require('../../assets/quiz_images/pig.png'),
  },
  {
    questionDzo: 'གཤམ་གྱི་དཔེ་རིས་ལས ཡིག་འབྲུ་ག་འདི་འགོ་བཙུགསཔ་སྨོ?',
    questionEng: 'From the picture below, which letter does it start with?',
    options: ['ཏ', 'ཐ', 'ད', 'ན'],
    correctAnswer: 'ད',
    image: require('../../assets/quiz_images/bear.png'),
  },
  {
    questionDzo: 'གཤམ་གྱི་དཔེ་རིས་ལས ཡིག་འབྲུ་ག་འདི་འགོ་བཙུགསཔ་སྨོ?',
    questionEng: 'From the picture below, which letter does it start with?',
    options: ['པ', 'ཕ', 'བ', 'མ'],
    correctAnswer: 'བ',
    image: require('../../assets/quiz_images/cow.png'),
  },
  {
    questionDzo: 'གཤམ་གྱི་དཔེ་རིས་ལས ཡིག་འབྲུ་ག་འདི་འགོ་བཙུགསཔ་སྨོ?',
    questionEng: 'From the picture below, which letter does it start with?',
    options: ['ཀ', 'ཁ', 'ག', 'ང'],
    correctAnswer: 'ག',
    image: require('../../assets/quiz_images/elephant.png'),
  },
  // {
  //   question: 'གཤམ་གྱི་དཔེ་རིས་ལས ཡིག་འབྲུ་ག་འདི་འགོ་བཙུགསཔ་སྨོ?',
  //   options: ['ཀ', 'ཁ', 'ག', 'ང'],
  //   correctAnswer: 'ཀ',
  //   image: require('../../assets/quiz_images/deer.png'),
  // },
];
