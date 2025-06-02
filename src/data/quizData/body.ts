type questionItem = {
  questionDzo: string;
  questionEng: string;
  options: string[];
  correctAnswer: string;
  image: any;
};

export const bodyQuizData: questionItem[] = [
  {
    questionDzo: 'གཤམ་གྱི་དཔེ་རིས་ལས ཡིག་འབྲུ་ག་འདི་འགོ་བཙུགསཔ་སྨོ?',
    questionEng: 'From the picture below, which letter does it start with?',
    options: ['ཧ', 'ཨ', 'ག', 'ང'],
    correctAnswer: 'ཨ',
    image: require('../../assets/quiz_images/apple.png'),
  },
  {
    questionDzo: 'གཤམ་གྱི་དཔེ་རིས་ལས ཡིག་འབྲུ་ག་འདི་འགོ་བཙུགསཔ་སྨོ?',
    questionEng: 'From the picture below, which letter does it start with?',
    options: ['ཀ', 'ཁ', 'ག', 'ང'],
    correctAnswer: 'ང',
    image: require('../../assets/quiz_images/banana.png'),
  },
  {
    questionDzo: 'གཤམ་གྱི་དཔེ་རིས་ལས ཡིག་འབྲུ་ག་འདི་འགོ་བཙུགསཔ་སྨོ?',
    questionEng: 'From the picture below, which letter does it start with?',
    options: ['ཙ', 'ཚ', 'ཛ', 'ཝ'],
    correctAnswer: 'ཚ',
    image: require('../../assets/quiz_images/bear.png'),
  },
  {
    questionDzo: 'གཤམ་གྱི་དཔེ་རིས་ལས ཡིག་འབྲུ་ག་འདི་འགོ་བཙུགསཔ་སྨོ?',
    questionEng: 'From the picture below, which letter does it start with?',
    options: ['ཀ', 'ཁ', 'ག', 'ང'],
    correctAnswer: 'ཁ',
    image: require('../../assets/quiz_images/elephant.png'),
  },
  {
    questionDzo: 'གཤམ་གྱི་དཔེ་རིས་ལས ཡིག་འབྲུ་ག་འདི་འགོ་བཙུགསཔ་སྨོ?',
    questionEng: 'From the picture below, which letter does it start with?',
    options: ['ཧ', 'ཨ', 'ག', 'ང'],
    correctAnswer: 'ཧ',
    image: require('../../assets/quiz_images/cow.png'),
  },
];
