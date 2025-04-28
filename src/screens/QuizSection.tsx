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

// Define types for our quiz data
interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
  image: any; // Using 'any' for the image require since it's appropriate for asset requires
}

const quizQuestions: QuizQuestion[] = [
  {
    question: 'What sound does a cow make?',
    options: ['Meow', 'Moo', 'Woof', 'Tweet'],
    correctAnswer: 'Moo',
    image: require('../assets/icons/animalIcon.png'),
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
    return () => {
      // For React Native versions < 0.65
      // Dimensions.removeEventListener('change', updateLayout);
      // For React Native versions >= 0.65
      // No cleanup needed as the event listener returns an unsubscribe function
    };
  }, []);

  const isLandscape = screenDimensions.width > screenDimensions.height;
  const isSmallScreen = screenDimensions.width < 375;
  const isMediumScreen =
    screenDimensions.width >= 375 && screenDimensions.width < 768;

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
  }, [currentQuestionIndex, quizCompleted]);

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
      Alert.alert('Try Again!', "That's not correct. Try another answer!", [
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
          <TouchableOpacity style={styles.resetButton} onPress={resetQuiz}>
            <Text style={styles.resetButtonText}>Play Again</Text>
          </TouchableOpacity>
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
        <View
          style={[
            styles.progressContainer,
            isLandscape && {width: isLandscape ? '100%' : '85%'},
          ]}>
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
            isLandscape && {width: isLandscape ? '46%' : '85%'},
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

        {/* Answer Options */}
        <View
          style={[
            styles.optionsContainer,
            isLandscape && styles.optionsContainerLandscape,
            isLandscape && {width: isLandscape ? '52%' : '85%'},
          ]}>
          {currentQuestion.options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.optionButton,
                isLandscape && styles.optionButtonLandscape,
                isSmallScreen && styles.optionButtonSmall,
              ]}
              onPress={() => handleAnswerPress(option)}>
              <Text
                style={[
                  styles.optionText,
                  isSmallScreen && styles.optionTextSmall,
                ]}>
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Score Display */}
        <View
          style={[
            styles.scoreContainer,
            isLandscape && {alignSelf: isLandscape ? 'flex-end' : 'center'},
          ]}>
          <Text style={styles.scoreLabel}>Score:</Text>
          <Text style={styles.scoreValue}>{score}</Text>
        </View>
      </Animated.View>
    );
  };

  return (
    <SharedLayout headerTitle="Fun Quiz Time!">
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
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
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
    marginBottom: 10,
    alignSelf: 'center',
  },
  questionText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#EF8D38',
    textAlign: 'center',
    marginBottom: 6,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 1,
  },
  questionTextSmall: {
    fontSize: 15,
  },
  imageContainer: {
    width: '100%',
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 3,
  },
  questionImage: {
    width: '60%',
    height: '60%',
    borderRadius: 8,
  },
  optionsContainer: {
    width: '85%',
    flexDirection: 'column',
    alignSelf: 'center',
  },
  optionsContainerLandscape: {
    flexDirection: 'column',
  },
  optionButton: {
    backgroundColor: 'rgba(38, 130, 244, 0.8)',
    borderRadius: 10,
    padding: 8,
    marginVertical: 3,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FFF',
    width: '100%',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
  },
  optionButtonLandscape: {
    width: '100%',
    marginVertical: 3,
  },
  optionButtonSmall: {
    padding: 6,
    marginVertical: 2,
  },
  optionText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#FFF',
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
    marginTop: 8,
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
  resetButton: {
    backgroundColor: '#FF8C00',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#FFF',
  },
  resetButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFF',
  },
});

export default QuizScreen;
