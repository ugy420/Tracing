type questionItem = {
  question: string;
  options: string[];
  correctAnswer: string;
  image: any;
};

export const animalsQuizData: questionItem[] = [
  {
    question: 'གཤམ་གྱི་དཔེ་རིས་ལས ཡིག་འབྲུ་ག་འདི་འགོ་བཙུགསཔ་སྨོ?',
    options: ['ཀ', 'ཁ', 'ག', 'ང'],
    correctAnswer: 'ཀ',
    image: require('../../assets/quiz_images/deer.png'),
  },
  {
    question: 'གཤམ་གྱི་དཔེ་རིས་ལས ཡིག་འབྲུ་ག་འདི་འགོ་བཙུགསཔ་སྨོ?',
    options: ['པ', 'ཕ', 'བ', 'མ'],
    correctAnswer: 'ཕ',
    image: require('../../assets/quiz_images/pig.png'),
  },
  {
    question: 'གཤམ་གྱི་དཔེ་རིས་ལས ཡིག་འབྲུ་ག་འདི་འགོ་བཙུགསཔ་སྨོ?',
    options: ['ཏ', 'ཐ', 'ད', 'ན'],
    correctAnswer: 'ད',
    image: require('../../assets/quiz_images/bear.png'),
  },
  {
    question: 'གཤམ་གྱི་དཔེ་རིས་ལས ཡིག་འབྲུ་ག་འདི་འགོ་བཙུགསཔ་སྨོ?',
    options: ['པ', 'ཕ', 'བ', 'མ'],
    correctAnswer: 'བ',
    image: require('../../assets/quiz_images/cow.png'),
  },
  {
    question: 'གཤམ་གྱི་དཔེ་རིས་ལས ཡིག་འབྲུ་ག་འདི་འགོ་བཙུགསཔ་སྨོ?',
    options: ['ཀ', 'ཁ', 'ག', 'ང'],
    correctAnswer: 'ག',
    image: require('../../assets/quiz_images/elephant.png'),
  },
];
