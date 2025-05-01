import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  Alert,
  Animated,
} from 'react-native';
import SharedLayout from '../components/SharedLayout';
import {useNavigation, NavigationProp} from '@react-navigation/native';
import {RootStackParamList} from '../types';

// Define types for our quiz data
interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
  image: any;
}

const quizQuestions: QuizQuestion[] = [
  {
    question: 'གཤམ་གྱི་དཔེ་རིས་ལས ཡིག་འབྲུ་ག་འདི་འགོ་བཙུགསཔ་སྨོ?',
    options: ['ཀ', 'ཁ', 'ག', 'ང'],
    correctAnswer: 'ཀ',
    image: require('../assets/quiz_images/deer.png'),
  },
  {
    question: 'Which animal has a long neck?',
    options: ['Elephant', 'Lion', 'Giraffe', 'Monkey'],
    correctAnswer: 'Giraffe',
    image: require('../assets/icons/fruitsIcon.png'),
  },
  {
    question: 'How many sides does a triangle have?',
    options: ['Three', 'Four', 'Five', 'Six'],
    correctAnswer: 'Three',
    image: require('../assets/icons/star.png'),
  },
  {
    question: 'What color is the sky on a sunny day?',
    options: ['Green', 'Red', 'Yellow', 'Blue'],
    correctAnswer: 'Blue',
    image: require('../assets/icons/weatherIcon.png'),
  },
  {
    question: 'Which fruit is red and grows on a tree?',
    options: ['Banana', 'Apple', 'Grapes', 'Orange'],
    correctAnswer: 'Apple',
    image: require('../assets/icons/familyIcon.png'),
  },
];

const QuizScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [quizCompleted, setQuizCompleted] = useState<boolean>(false);
  const [fadeAnim] = useState<Animated.Value>(new Animated.Value(0));
  const [bounceAnim] = useState<Animated.Value>(new Animated.Value(0));
  const [screenDimensions, setScreenDimensions] = useState<{
    width: number;
    height: number;
  }>(Dimensions.get('window'));

  useEffect(() => {
    // Handle screen dimension changes
    const updateLayout = () => {
      setScreenDimensions(Dimensions.get('window'));
    };

    Dimensions.addEventListener('change', updateLayout);

    // Cleanup
    return () => {};
  }, []);

  const isLandscape = screenDimensions.width > screenDimensions.height;
  const isSmallScreen = screenDimensions.width < 375;

  useEffect(() => {
    // Fade in animation for each new question or completion screen
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();

    // Bounce animation for the question
    Animated.spring(bounceAnim, {
      toValue: 1,
      friction: 5,
      tension: 40,
      useNativeDriver: true,
    }).start();
  }, [bounceAnim, currentQuestionIndex, fadeAnim, quizCompleted]);

  const handleAnswerPress = (selectedAnswer: string): void => {
    const currentQuestion = quizQuestions[currentQuestionIndex];

    if (selectedAnswer === currentQuestion.correctAnswer) {
      // Correct answer
      playCorrectSound();

      // Increase score
      setScore(score + 1);

      // Move to next question or complete quiz
      if (currentQuestionIndex < quizQuestions.length - 1) {
        // Reset animations
        fadeAnim.setValue(0);
        bounceAnim.setValue(0);

        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        // Instead of showing alert, just transition to completion screen
        fadeAnim.setValue(0);
        setQuizCompleted(true);
      }
    } else {
      // Wrong answer
      playWrongSound();
      Alert.alert('དགོངསམ་མ་ཁྲེལ།', 'ཁྱོད་ཀྱིས་གདམ་ཁ་འཛོལ་བ་འབད་ཡི།', [
        {text: 'OK'},
      ]);
    }
  };

  const playCorrectSound = (): void => {
    // Placeholder for sound effect functionality
    console.log('Playing correct sound');
  };

  const playWrongSound = (): void => {
    // Placeholder for sound effect functionality
    console.log('Playing wrong sound');
  };

  const resetQuiz = (): void => {
    setCurrentQuestionIndex(0);
    setScore(0);
    setQuizCompleted(false);
    fadeAnim.setValue(0);
    bounceAnim.setValue(0);

    // Start animations again
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();

    Animated.spring(bounceAnim, {
      toValue: 1,
      friction: 5,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const renderQuizContent = (): JSX.Element => {
    if (quizCompleted) {
      return (
        <Animated.View
          style={[styles.completionContainer, {opacity: fadeAnim}]}>
          <Text style={styles.completionText}>Quiz Completed!</Text>
          <Text style={styles.scoreText}>
            Your Score: {score} / {quizQuestions.length}
          </Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.resetButton} onPress={resetQuiz}>
              <Text style={styles.resetButtonText}>Play Again</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.nextButton}
              onPress={() => navigation.navigate('UnGuided')}>
              <Text style={styles.nextButtonText}>Next</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      );
    }

    const currentQuestion = quizQuestions[currentQuestionIndex];

    const bounceInterpolation = bounceAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [20, 0],
    });

    return (
      <Animated.View
        style={[
          styles.quizContainer,
          isLandscape && styles.quizContainerLandscape,
          {opacity: fadeAnim},
        ]}>
        {/* Progress indicator */}
        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>
            Q{currentQuestionIndex + 1}/{quizQuestions.length}
          </Text>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${
                    ((currentQuestionIndex + 1) / quizQuestions.length) * 100
                  }%`,
                },
              ]}
            />
          </View>
        </View>

        {/* Question */}
        <Animated.View
          style={[
            styles.questionContainer,
            {transform: [{translateY: bounceInterpolation}]},
          ]}>
          <Text
            style={[
              styles.questionText,
              isSmallScreen && styles.questionTextSmall,
            ]}>
            {currentQuestion.question}
          </Text>

          {/* Question Image */}
          <View style={styles.imageContainer}>
            <Image
              source={currentQuestion.image}
              style={styles.questionImage}
              resizeMode="contain"
            />
          </View>
        </Animated.View>

        {/* Answer Options in 2x2 grid */}
        <View style={styles.optionsGridContainer}>
          <View style={styles.optionsRow}>
            <TouchableOpacity
              style={[
                styles.optionButton,
                styles.optionButtonGrid,
                isSmallScreen && styles.optionButtonSmall,
              ]}
              onPress={() => handleAnswerPress(currentQuestion.options[0])}>
              <Text
                style={[
                  styles.optionText,
                  isSmallScreen && styles.optionTextSmall,
                ]}>
                {currentQuestion.options[0]}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.optionButton,
                styles.optionButtonGrid,
                isSmallScreen && styles.optionButtonSmall,
              ]}
              onPress={() => handleAnswerPress(currentQuestion.options[1])}>
              <Text
                style={[
                  styles.optionText,
                  isSmallScreen && styles.optionTextSmall,
                ]}>
                {currentQuestion.options[1]}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.optionsRow}>
            <TouchableOpacity
              style={[
                styles.optionButton,
                styles.optionButtonGrid,
                isSmallScreen && styles.optionButtonSmall,
              ]}
              onPress={() => handleAnswerPress(currentQuestion.options[2])}>
              <Text
                style={[
                  styles.optionText,
                  isSmallScreen && styles.optionTextSmall,
                ]}>
                {currentQuestion.options[2]}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.optionButton,
                styles.optionButtonGrid,
                isSmallScreen && styles.optionButtonSmall,
              ]}
              onPress={() => handleAnswerPress(currentQuestion.options[3])}>
              <Text
                style={[
                  styles.optionText,
                  isSmallScreen && styles.optionTextSmall,
                ]}>
                {currentQuestion.options[3]}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Score Display */}
        <View style={styles.scoreContainer}>
          <Text style={styles.scoreLabel}>Score:</Text>
          <Text style={styles.scoreValue}>{score}</Text>
        </View>
      </Animated.View>
    );
  };

  return (
    <SharedLayout>
      <View style={styles.container}>{renderQuizContent()}</View>
    </SharedLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quizContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  quizContainerLandscape: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  progressContainer: {
    width: '85%',
    marginBottom: 8,
    alignSelf: 'center',
  },
  progressText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#2682F4',
    marginBottom: 2,
    textAlign: 'center',
  },
  progressBar: {
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 3,
    borderWidth: 1,
    borderColor: '#2682F4',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FF8C00',
    borderRadius: 3,
  },
  questionContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderRadius: 12,
    padding: 8,
    width: '85%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2682F4',
    marginBottom: 15,
    alignSelf: 'center',
  },
  questionText: {
    fontSize: 40,
    fontFamily: 'joyig',
    color: '#EF8D38',
    textAlign: 'center',
    marginBottom: 6,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 1,
  },
  questionTextSmall: {
    fontSize: 15,
    fontFamily: 'joyig',
  },
  imageContainer: {
    width: '100%',
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 3,
  },
  questionImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
    resizeMode: 'contain',
  },
  optionsGridContainer: {
    width: '85%',
    alignSelf: 'center',
    marginBottom: 10,
  },
  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  optionButton: {
    backgroundColor: 'rgba(38, 130, 244, 0.8)',
    borderRadius: 10,
    padding: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
  },
  optionButtonGrid: {
    width: '48%',
    minHeight: 45,
    justifyContent: 'center',
  },
  optionButtonSmall: {
    padding: 6,
    minHeight: 40,
  },
  optionText: {
    fontSize: 30,
    fontFamily: 'joyig',
    color: '#FFF',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 1,
  },
  optionTextSmall: {
    fontSize: 13,
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#FF8C00',
    alignSelf: 'center',
  },
  scoreLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2682F4',
    marginRight: 5,
  },
  scoreValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF8C00',
  },
  completionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#2682F4',
    width: '80%',
    maxHeight: '60%',
    alignSelf: 'center',
  },
  completionText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#EF8D38',
    marginBottom: 15,
    textAlign: 'center',
  },
  scoreText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2682F4',
    marginBottom: 25,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  resetButton: {
    backgroundColor: '#FF8C00',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#FFF',
    marginRight: 10,
  },
  resetButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFF',
  },
  nextButton: {
    backgroundColor: '#2682F4',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#FFF',
    marginLeft: 10,
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFF',
  },
});

export default QuizScreen;
