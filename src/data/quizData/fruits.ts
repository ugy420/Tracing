type questionItem = {
  question: string;
  options: string[];
  correctAnswer: string;
  image: any;
};

export const fruitsQuizData: questionItem[] = [
  {
    question: 'གཤམ་གྱི་དཔེ་རིས་ལས ཡིག་འབྲུ་ག་འདི་འགོ་བཙུགསཔ་སྨོ?',
    options: ['ཧ', 'ཨ', 'ག', 'ང'],
    correctAnswer: 'ཨ',
    image: require('../../assets/quiz_images/apple.png'),
  },
  {
    question: 'གཤམ་གྱི་དཔེ་རིས་ལས ཡིག་འབྲུ་ག་འདི་འགོ་བཙུགསཔ་སྨོ?',
    options: ['ཀ', 'ཁ', 'ག', 'ང'],
    correctAnswer: 'ང',
    image: require('../../assets/quiz_images/banana.png'),
  },
  {
    question: 'གཤམ་གྱི་དཔེ་རིས་ལས ཡིག་འབྲུ་ག་འདི་འགོ་བཙུགསཔ་སྨོ? Orange',
    options: ['ཙ', 'ཚ', 'ཛ', 'ཝ'],
    correctAnswer: 'ཚ',
    image: require('../../assets/quiz_images/orange.png'),
  },
  {
    question: 'གཤམ་གྱི་དཔེ་རིས་ལས ཡིག་འབྲུ་ག་འདི་འགོ་བཙུགསཔ་སྨོ? Watermelon',
    options: ['ཀ', 'ཁ', 'ག', 'ང'],
    correctAnswer: 'ཁ',
    image: require('../../assets/quiz_images/melon.png'),
  },
  {
    question: 'གཤམ་གྱི་དཔེ་རིས་ལས ཡིག་འབྲུ་ག་འདི་འགོ་བཙུགསཔ་སྨོ? Lemon',
    options: ['ཧ', 'ཨ', 'ག', 'ང'],
    correctAnswer: 'ཧ',
    image: require('../../assets/quiz_images/lemon.png'),
  },
];
