type questionItem = {
  question: string;
  options: string[];
  correctAnswer: string;
  image: any;
};

export const fruitsQuizData: questionItem[] = [
  {
    question: 'This is fruit section ?',
    options: ['ཀ', 'ཁ', 'ག', 'ང'],
    correctAnswer: 'ཀ',
    image: require('../../assets/quiz_images/deer.png'),
  },
  {
    question: 'Which animal has a long neck?',
    options: ['Elephant', 'Lion', 'Giraffe', 'Monkey'],
    correctAnswer: 'Giraffe',
    image: require('../../assets/icons/fruitsIcon.png'),
  },
  {
    question: 'How many sides does a triangle have?',
    options: ['Three', 'Four', 'Five', 'Six'],
    correctAnswer: 'Three',
    image: require('../../assets/icons/star.png'),
  },
  {
    question: 'What color is the sky on a sunny day?',
    options: ['Green', 'Red', 'Yellow', 'Blue'],
    correctAnswer: 'Blue',
    image: require('../../assets/icons/weatherIcon.png'),
  },
  {
    question: 'Which fruit is red and grows on a tree?',
    options: ['Banana', 'Apple', 'Grapes', 'Orange'],
    correctAnswer: 'Apple',
    image: require('../../assets/icons/familyIcon.png'),
  },
];
