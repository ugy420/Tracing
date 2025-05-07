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
  ImageBackground,
} from 'react-native';
import {
  useNavigation,
  NavigationProp,
  RouteProp,
  useRoute,
} from '@react-navigation/native';
import {RootStackParamList} from '../types';
import {fruitsQuizData} from '../data/quizData/fruits';
import {animalsQuizData} from '../data/quizData/animals';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LottieView from 'lottie-react-native';

const QuizScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [quizCompleted, setQuizCompleted] = useState<boolean>(false);
  const [fadeAnim] = useState<Animated.Value>(new Animated.Value(0));
  const [bounceAnim] = useState<Animated.Value>(new Animated.Value(0));
  const route = useRoute<RouteProp<RootStackParamList, 'QuizScreen'>>();
  const {category} = route.params;
  const [earnedStars, setEarnedStars] = useState<number>(0);
  const [previouslyCompleted, setPreviouslyCompleted] =
    useState<boolean>(false);
  const [showCelebration, setShowCelebration] = useState<boolean>(false);

  const [screenDimensions] = useState<{
    width: number;
    height: number;
  }>(Dimensions.get('window'));

  const quizQuestions =
    category === 'animals'
      ? animalsQuizData
      : category === 'fruits'
      ? fruitsQuizData
      : category === 'body'
      ? fruitsQuizData
      : [];

  const isSmallScreen = screenDimensions.width < 375;

  useEffect(() => {
    checkPreviousCompletion();
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

  const checkPreviousCompletion = async () => {
    try {
      const quizKey = `quiz_${category}_completed`;
      const starKey = `quiz_${category}_stars`;

      const completedStatus = await AsyncStorage.getItem(quizKey);
      const previousStars = await AsyncStorage.getItem(starKey);

      if (completedStatus === 'true' && previousStars) {
        setPreviouslyCompleted(true);
        setEarnedStars(parseInt(previousStars, 10));
      }
    } catch (error) {
      console.error('Error checking previous completion:', error);
    }
  };

  const saveQuizCompletion = async (stars: number) => {
    try {
      const quizKey = `quiz_${category}_completed`;
      const starKey = `quiz_${category}_stars`;

      await AsyncStorage.setItem(quizKey, 'true');
      await AsyncStorage.setItem(starKey, stars.toString());

      // update category star in the main storage
      await updateCategoryStars(category, stars);
    } catch (error) {
      console.error('Error saving quiz completion:', error);
    }
  };

  const updateCategoryStars = async (categoryName: string, stars: number) => {
    try {
      // Get current stars data
      const starsData = await AsyncStorage.getItem('category_stars');
      const currentStarsData = starsData ? JSON.parse(starsData) : {};

      // Update stars for this category
      currentStarsData[categoryName] = stars;

      // Save updated stars data
      await AsyncStorage.setItem(
        'category_stars',
        JSON.stringify(currentStarsData),
      );
    } catch (error) {
      console.error('Error updating category stars:', error);
    }
  };

  const calculateStars = (score: number, total: number): number => {
    const percentage = (score / total) * 100;
    if (percentage >= 90) {
      return 3;
    }
    if (percentage >= 70) {
      return 2;
    }
    if (percentage >= 50) {
      return 1;
    }
    return 0;
  };

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
        // Calculate stars based on score
        const stars = calculateStars(score + 1, quizQuestions.length);
        setEarnedStars(stars);

        // Save progress if not previously completed or if new score is better
        if (!previouslyCompleted || stars > earnedStars) {
          saveQuizCompletion(stars);
        }

        // Show celebration animation
        fadeAnim.setValue(0);
        setQuizCompleted(true);
        setShowCelebration(true);
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
    setShowCelebration(false);
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

  // const renderStars = (count: number) => {
  //   const stars = [];
  //   for (let i = 0; i < 3; i++) {
  //     stars.push(
  //       <Image
  //         key={i}
  //         source={
  //           i < count
  //             ? require('../assets/icons/star.png') // Replace with your star image
  //             : require('../assets/icons/star-empty.png') // Replace with your empty star image
  //         }
  //         style={styles.starImage}
  //       />,
  //     );
  //   }
  //   return stars;
  // };

  const renderQuizContent = (): JSX.Element => {
    if (quizCompleted) {
      return (
        // <Animated.View
        //   style={[styles.completionContainer, {opacity: fadeAnim}]}>
        //   {showCelebration && (
        //     <View style={styles.celebrationOverlay}>
        //       {/* Replace with your Lottie animation or custom celebration UI */}
        //       <LottieView
        //         source={require('../assets/lottie_anime/celebration1.json')}
        //         autoPlay
        //         loop={true}
        //         style={styles.celebrationAnimation}
        //         onAnimationFinish={() => setShowCelebration(false)}
        //       />
        //     </View>
        //   )}

        //   <Text style={styles.completionText}>Quiz Completed!</Text>
        //   <Text style={styles.scoreText}>
        //     Your Score: {score} / {quizQuestions.length}
        //   </Text>

        //   <View style={styles.starsContainer}>{renderStars(earnedStars)}</View>

        //   {previouslyCompleted && (
        //     <Text style={styles.previousCompletionText}>
        //       You've already completed this quiz before!
        //     </Text>
        //   )}

        //   <View style={styles.buttonContainer}>
        //     <TouchableOpacity style={styles.resetButton} onPress={resetQuiz}>
        //       <Text style={styles.resetButtonText}>Play Again</Text>
        //     </TouchableOpacity>
        //     <TouchableOpacity
        //       style={styles.nextButton}
        //       onPress={() => navigation.navigate('QuizHomeScreen')}>
        //       <Text style={styles.nextButtonText}>Back to Quiz Category</Text>
        //     </TouchableOpacity>

        <ImageBackground
          source={require('../assets/background_images/guided_bg.jpeg')} // Replace with your background image
          style={styles.completionBackground}>
          <View style={styles.completionSideImagesContainer}>
            {/* Left side image */}
            <Image
              source={require('../assets/icons/boy.png')} // Replace with your left image
              style={styles.completionSideImage}
              resizeMode="contain"
            />

            {/* Completion container */}
            <Animated.View
              style={[styles.completionContainer, {opacity: fadeAnim}]}>
              <Text style={styles.completionText}>Quiz Completed!</Text>
              <Text style={styles.scoreText}>
                Your Score: {score} / {quizQuestions.length}
              </Text>
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={styles.resetButton}
                  onPress={resetQuiz}>
                  <Text style={styles.resetButtonText}>Play Again</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.nextButton}
                  onPress={() => navigation.navigate('UnGuided')}>
                  <Text style={styles.nextButtonText}>Next</Text>
                </TouchableOpacity>
              </View>
            </Animated.View>

            {/* Right side image */}
            <Image
              source={require('../assets/icons/girl.png')} // Replace with your right image
              style={styles.completionSideImage}
              resizeMode="contain"
            />
          </View>
        </ImageBackground>
      );
    }

    const currentQuestion = quizQuestions[currentQuestionIndex];

    const bounceInterpolation = bounceAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [20, 0],
    });

    return (
      <ImageBackground
        source={require('../assets/background_images/landing_bg.png')} // Replace with your background
        style={styles.backgroundImage}>
        <Animated.View style={[styles.quizContainer, {opacity: fadeAnim}]}>
          {/* Progress indicator */}
          <View style={styles.progressContainer}>
            <Text style={styles.progressText}>
              Q {currentQuestionIndex + 1}/{quizQuestions.length}
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
        </Animated.View>
      </ImageBackground>
    );
  };

  return <View style={styles.container}>{renderQuizContent()}</View>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
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
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#2682F4',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FF8C00',
    borderRadius: 4,
  },
  questionContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 20,
    padding: 5,
    width: '85%',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#2682F4',
    marginBottom: 8,
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  questionText: {
    fontSize: 40,
    fontFamily: 'joyig',
    color: '#EF8D38',
    textAlign: 'center',
    marginBottom: 1,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 2,
  },
  questionTextSmall: {
    fontSize: 20,
    fontFamily: 'joyig',
  },
  imageContainer: {
    width: '100%',
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 1,
  },
  questionImage: {
    width: '100%',
    height: '100%',
    borderRadius: 15,
    resizeMode: 'contain',
  },
  optionsGridContainer: {
    width: '85%',
    alignSelf: 'center',
    marginBottom: 1,
  },
  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  optionButton: {
    backgroundColor: 'rgba(38, 130, 244, 0.9)',
    borderRadius: 15,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  optionButtonGrid: {
    width: '48%',
    minHeight: 55,
    justifyContent: 'center',
  },
  optionButtonSmall: {
    padding: 6,
    minHeight: 40,
  },
  optionText: {
    fontSize: 45,
    fontFamily: 'joyig',
    color: '#FFF',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 2,
  },
  optionTextSmall: {
    fontSize: 18,
  },

  // scoreContainer: {
  //   flexDirection: 'row',
  //   alignItems: 'center',
  //   marginBottom: 20,
  //   paddingHorizontal: 15,
  //   paddingVertical: 3,
  //   backgroundColor: 'rgba(255, 255, 255, 0.9)',
  //   borderRadius: 10,
  //   borderWidth: 2,
  //   borderColor: '#FF8C00',
  //   alignSelf: 'center',
  //   shadowColor: '#000',
  //   shadowOffset: {width: 0, height: 2},
  //   shadowOpacity: 0.2,
  //   shadowRadius: 2,
  //   elevation: 3,
  // },
  // scoreIcon: {
  //   width: 28,
  //   height: 28,
  //   marginRight: 8,
  // },
  // scoreValue: {
  //   fontSize: 24,
  //   fontWeight: 'bold',
  //   color: '#FF8C00',
  // },

  // completionContainer: {
  //   // Add your styles here
  // },
  // New and modified completion screen styles
  completionBackground: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  completionSideImagesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '95%', // Use most of the screen width
  },
  completionSideImage: {
    width: 200,
    height: 200,
  },
  completionContainer: {
    flex: 0, // Changed from flex: 1 to not expand
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: 70,
    borderRadius: 25,
    borderWidth: 3,
    borderColor: '#2682F4',
    // width: '80%',
    // maxHeight: '80%',
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
    width: '50%', // Reduced from 80% to make room for images
    maxHeight: '100%',
  },
  completionText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#EF8D38',
    marginBottom: 10,
    textAlign: 'center',
  },

  scoreText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2682F4',
    marginBottom: 10,
    textAlign: 'center',
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 15,
  },
  starImage: {
    width: 45,
    height: 45,
    marginHorizontal: 5,
  },
  previousCompletionText: {
    fontSize: 16,
    fontStyle: 'italic',
    color: '#666',
    marginBottom: 20,
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
    paddingVertical: 12,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#FFF',
    marginRight: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  resetButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
  },
  nextButton: {
    backgroundColor: '#2682F4',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#FFF',
    marginLeft: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  nextButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
  },
  celebrationOverlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  celebrationAnimation: {
    width: 300,
    height: 300,
  },
});

export default QuizScreen;
