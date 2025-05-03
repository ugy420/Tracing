import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  FlatList,
  Image,
  Dimensions,
  Modal,
  Text,
  Button,
} from 'react-native';
import achievement from '../assets/achievementImages';
import {RootStackParamList} from '../types';
import {useNavigation, NavigationProp} from '@react-navigation/native';
import axiosInstance from '../Api/config/axiosInstance';
import api from '../Api/endPoints';
import Orientation from 'react-native-orientation-locker';
import AsyncStorage from '@react-native-async-storage/async-storage';

const {width, height} = Dimensions.get('window');

const AchievementScreen = () => {
  const [achievements, setAchievements] = useState<
    {id: number; is_earned: boolean}[]
  >([]);
  const [selectedAchievement, setSelectedAchievement] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [, setIsGuest] = useState(false);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  useEffect(() => {
    // Fetching user achivements and combine with local achievements
    const fetchAchievements = async () => {
      try {
        // Guest Mode
        // Check if the user is a guest
        const isGuestValue = await AsyncStorage.getItem('is_guest');
        setIsGuest(isGuestValue === 'true');

        if (isGuestValue === 'true') {
          // Guest Mode: Use local mock data
          const localAchievements = [
            {
              id: 1,
              name: 'གསལ་བྱེད་ རྒྱལ་རྟགས།',
              criteria: 'གསལ་བྱེད་ག་ར་ འཁྱིད་ཐིག་འབད།',
              image: achievement.achievement1,
              is_earned: true,
            },
            {
              id: 2,
              name: 'ཨང་གྲངས་ རྒྱལ་རྟགས།',
              criteria: 'ཨང་གྲངས་ག་ར་ འཁྱིད་ཐིག་འབད།',
              image: achievement.achievement2,
              is_earned: false,
            },
            {
              id: 3,
              name: 'དབྱངས་ རྒྱལ་རྟགས།',
              criteria: 'དབྱངས་ག་ར་ འཁྱིད་ཐིག་འབད།',
              image: achievement.achievement3,
              is_earned: false,
            },
            {
              id: 4,
              name: 'སེམས་ཅན་མཁས་མཆོག་ རྒྱལ་རྟགས།',
              criteria: 'སེམས་ཅན་གི་ འདྲི་རྩད་རྒྱུགས་ འདི་མཇུག་བསྡུ།',
              image: achievement.achievement4,
              is_earned: false,
            },
            {
              id: 5,
              name: 'ཤིང་འབྲས་མཁས་མཆོག་ རྒྱལ་རྟགས།',
              criteria: 'ཤིང་འབྲས་གི་ འདྲི་རྩད་རྒྱུགས་ འདི་མཇུག་བསྡུ།',
              image: achievement.achievement5,
              is_earned: false,
            },
          ];
          setAchievements(localAchievements);
        } else {
          // Online Mode
          const response = await axiosInstance.get(
            api.achievement.getUserAchievements,
          );

          // Get all the achievements
          const allAchievementsResponse = await axiosInstance.get(
            api.achievement.getAchievements,
          );

          const userAchievements = response.data || [];
          const allAchievements = allAchievementsResponse.data;

          // console.log('User achievements:', response.data);

          const combinedAchievements = allAchievements.map(
            (achievementItem: any, index: number) => ({
              ...achievementItem,
              image:
                achievement[
                  `achievement${index + 1}` as keyof typeof achievement
                ],
              is_earned: userAchievements.some(
                (userAchievement: any) =>
                  userAchievement.id === achievementItem.id,
              ),
            }),
          );
          setAchievements(combinedAchievements);
        }
      } catch (error) {
        console.error('Error fetching achievements:', error);
      }
    };

    Orientation.lockToLandscape();
    fetchAchievements();
  }, []);

  const handleAchievementPress = (item: any) => {
    setSelectedAchievement(item);
    setModalVisible(true);
  };

  const renderAchievement = ({item}: {item: any}) => (
    <TouchableOpacity
      style={styles.avatarContainer}
      onPress={() => handleAchievementPress(item)}>
      <Image
        source={item.image}
        style={[
          styles.avatarImage,
          item.is_earned
            ? styles.earnedAchievement
            : styles.unearnedAchievement,
        ]}
      />
    </TouchableOpacity>
  );
  return (
    <ImageBackground
      source={require('../assets/background_images/guided_bg.jpeg')}
      style={styles.background}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('Guided')}>
          <Image
            source={require('../assets/icons/back_color.png')}
            style={styles.headerIcon}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.avatarWindow}>
        <Image
          source={require('../assets/icons/avatarWindow.png')}
          style={styles.avatarWindowImage}
        />
        <View style={styles.container}>
          <FlatList
            data={achievements}
            keyExtractor={item => item.id.toString()}
            numColumns={4}
            contentContainerStyle={styles.flatListStyle}
            renderItem={renderAchievement}
          />
        </View>

        {selectedAchievement &&
          (console.log('Selected Achievement:', selectedAchievement),
          (
            <Modal
              animationType="slide"
              transparent={true}
              visible={modalVisible}
              onRequestClose={() => setModalVisible(false)}>
              <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                  <Text style={styles.modalTitle}>
                    {selectedAchievement.name}
                  </Text>
                  <Text style={styles.modalCriteria}>
                    {selectedAchievement.criteria}
                  </Text>
                  <Button
                    title="Close"
                    onPress={() => setModalVisible(false)}
                  />
                </View>
              </View>
            </Modal>
          ))}
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '100%',
    padding: 10,
    position: 'absolute',
    top: 0,
  },
  headerIcon: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
  avatarWindow: {
    width: width * 0.6,
    height: height * 0.6,
    padding: 10,
    marginBottom: height * 0.05,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarWindowImage: {
    position: 'absolute',
    width: '110 %',
    height: '160%',
    resizeMode: 'stretch',
  },
  flatListStyle: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '140%',
  },
  avatarContainer: {
    margin: 5,
    width: (width * 0.6) / 4 - 20,
    height: (height * 0.6) / 3 - 10,
    backgroundColor: '#64748B',
    borderRadius: 7,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarImage: {
    width: '90%',
    height: '80%',
    resizeMode: 'contain',
  },
  earnedAchievement: {
    borderColor: 'gold',
    borderWidth: 2,
  },
  unearnedAchievement: {
    opacity: 0.5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: height * 0.15,
    fontFamily: 'joyig',
  },
  modalCriteria: {
    fontSize: height * 0.12,
    fontFamily: 'joyig',
    marginBottom: 2,
    textAlign: 'center',
    color: 'gray',
  },
});

export default AchievementScreen;
