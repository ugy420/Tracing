import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  FlatList,
  Image,
  Modal,
  Button,
  Dimensions,
  Alert,
  ActivityIndicator,
} from 'react-native';
import avatarImages from '../assets/avatarImages';
import {RootStackParamList} from '../types';
import {useNavigation, NavigationProp} from '@react-navigation/native';
import axiosInstance from '../Api/config/axiosInstance';
import api from '../Api/endPoints';
import AsyncStorage from '@react-native-async-storage/async-storage';

const {width, height} = Dimensions.get('window');

const AvatarScreen = () => {
  interface AvatarBorder {
    id: number;
    name: string;
    cost: number;
    image: any;
    is_purchased: boolean;
  }

  const [avatarBorders, setAvatarBorders] = useState<AvatarBorder[]>([]);
  const [selectedBorder, setSelectedBorder] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [currentAvatarBorder, setCurrentAvatarBorder] = useState<any>(null);
  const [isGuest, setIsGuest] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeScreen = async () => {
      setLoading(true);
      try {
        // Check if the user is a guest
        const isGuestValue = await AsyncStorage.getItem('is_guest');
        setIsGuest(isGuestValue === 'true');

        if (isGuestValue === 'true') {
          // Guest Mode: Use local data
          const storedBorders = await AsyncStorage.getItem(
            'guest_avatar_borders',
          );
          const localBorders = storedBorders
            ? JSON.parse(storedBorders)
            : [
                {
                  id: 1,
                  name: 'རག་གྱི་ མཐའ་མཚམས།',
                  cost: 10,
                  image: avatarImages.avatar8,
                  is_purchased: false,
                },
                {
                  id: 2,
                  name: 'དངུལ་གྱི་ མཐའ་མཚམས།',
                  cost: 20,
                  image: avatarImages.avatar2,
                  is_purchased: false,
                },
                {
                  id: 3,
                  name: 'གསེར་གྱི་ མཐའ་མཚམས།',
                  cost: 50,
                  image: avatarImages.avatar1,
                  is_purchased: false,
                },
                {
                  id: 4,
                  name: 'རྡོ་རྗེ་ཕ་ལམ་གྱི་ མཐའ་མཚམས།',
                  cost: 75,
                  image: avatarImages.avatar5,
                  is_purchased: false,
                },
              ];
          setAvatarBorders(localBorders);

          // Check if a border is equipped locally
          const equippedBorder = await AsyncStorage.getItem(
            'guest_current_avatar_border',
          );
          setCurrentAvatarBorder(
            equippedBorder ? Number(equippedBorder) : null,
          );
        } else {
          // Online Mode: Fetch data from the backend
          const userId = await AsyncStorage.getItem('user_id');
          if (!userId) {
            console.error('User ID not found in AsyncStorage');
            return;
          }

          const purchasedBorderResponses = await axiosInstance.get(
            api.avatar.getUserAvatarBorders,
          );
          const allBorderRespose = await axiosInstance.get(
            api.avatar.getAvatarBorders,
          );

          const allBorders = allBorderRespose.data;
          const purchasedBorders = purchasedBorderResponses.data;

          // User equip border
          const equippedAvatarBorder = await AsyncStorage.getItem(
            'current_avatar_border',
          );
          setCurrentAvatarBorder(
            equippedAvatarBorder ? Number(equippedAvatarBorder) : null,
          );

          const combinedBorders = allBorders.map(
            (border: any, index: number) => ({
              ...border,
              image:
                avatarImages[`avatar${index + 1}` as keyof typeof avatarImages],
              is_purchased: purchasedBorders.some(
                (purchasedBorder: any) => purchasedBorder.id === border.id,
              ),
            }),
          );

          setAvatarBorders(combinedBorders);
        }
      } catch (error) {
        console.error('Error initializing AvatarScreen:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeScreen();
  }, []);

  const handleBorderPress = (border: any) => {
    setSelectedBorder(border);
    setModalVisible(true);
  };

  const renderBorder = ({item}: {item: any}) => (
    <TouchableOpacity
      style={[
        styles.avatarContainer,
        item.id === currentAvatarBorder && styles.equippedBorder,
      ]}
      onPress={() => handleBorderPress(item)}>
      <Image
        source={item.image}
        style={[
          styles.avatarImage,
          item.is_purchased ? styles.purchasedBorder : styles.unpurchasedBorder,
        ]}
      />
    </TouchableOpacity>
  );

  const handleBuyBorder = async () => {
    if (isGuest) {
      const guest_starCount = await AsyncStorage.getItem('guest_starCount');
      // Guest Mode: Update local data
      if (selectedBorder.cost > Number(guest_starCount)) {
        Alert.alert('You do not have enough stars to purchase this border.');
        return;
      }

      const updatedBorders = avatarBorders.map(border =>
        border.id === selectedBorder.id
          ? {...border, is_purchased: true}
          : border,
      );
      setAvatarBorders(updatedBorders);
      await AsyncStorage.setItem(
        'guest_avatar_borders',
        JSON.stringify(updatedBorders),
      );
      Alert.alert('Border purchased successfully!');
      setModalVisible(false);
    } else {
      // Online Mode: Perform backend operations
      try {
        const userId = await AsyncStorage.getItem('user_id');
        if (!userId) {
          console.error('User ID not found in AsyncStorage');
          return;
        }

        const userDetails = await axiosInstance.get(
          api.user.getUserData(Number(userId)),
        );
        const userStars = userDetails.data.starCount;

        if (userStars < selectedBorder.cost) {
          Alert.alert('You do not have enough stars to purchase this border.');
        } else {
          const updatedStars = userStars - selectedBorder.cost;

          await axiosInstance.post(api.user.updateUserData(Number(userId)), {
            starCount: updatedStars,
          });

          await axiosInstance.post(api.avatar.updateUserAvatarBorder, {
            avatar_border_id: selectedBorder.id,
          });

          const purchasedBorderResponses = await axiosInstance.get(
            api.avatar.getUserAvatarBorders,
          );
          const allBorderRespose = await axiosInstance.get(
            api.avatar.getAvatarBorders,
          );

          const allBorders = allBorderRespose.data;
          const purchasedBorders = purchasedBorderResponses.data;

          const combinedBorders = allBorders.map(
            (border: any, index: number) => ({
              ...border,
              image:
                avatarImages[`avatar${index + 1}` as keyof typeof avatarImages],
              is_purchased: purchasedBorders.some(
                (purchasedBorder: any) => purchasedBorder.id === border.id,
              ),
            }),
          );

          setAvatarBorders(combinedBorders);
          Alert.alert('Border purchased successfully!');
          setModalVisible(false);
        }
      } catch (error) {
        console.error('Error purchasing border:', error);
        Alert.alert(
          'An error occurred while purchasing the border. Please try again.',
        );
      }
    }
  };

  const handleEquipBorder = async () => {
    if (isGuest) {
      // Guest Mode: Update local data
      await AsyncStorage.setItem(
        'guest_current_avatar_border',
        selectedBorder.id.toString(),
      );
      setCurrentAvatarBorder(selectedBorder.id);
      Alert.alert('Border equipped successfully!');
      navigation.navigate('Guided');
      setModalVisible(false);
    } else {
      // Online Mode: Perform backend operations
      try {
        const userId = await AsyncStorage.getItem('user_id');
        if (!userId) {
          console.error('User ID not found in AsyncStorage');
          return;
        }

        await axiosInstance.patch(api.user.updateUserData(Number(userId)), {
          current_avatar_border_id: selectedBorder.id,
        });

        await AsyncStorage.setItem(
          'current_avatar_border',
          selectedBorder.id.toString(),
        );
        setCurrentAvatarBorder(selectedBorder.id);
        Alert.alert('Border equipped successfully!');
        setModalVisible(false);
      } catch (error) {
        console.error('Error equipping border:', error);
        Alert.alert(
          'An error occurred while equipping the border. Please try again.',
        );
      }
    }
  };

  if (loading) {
    // Show loading indicator while data is being fetched
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading...</Text>
      </View>
    );
  }

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
            data={avatarBorders}
            keyExtractor={item => item.id.toString()}
            numColumns={4}
            contentContainerStyle={styles.flatListStyle}
            renderItem={renderBorder}
          />
        </View>
      </View>

      {selectedBorder && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>{selectedBorder.name}</Text>
              <Image source={selectedBorder.image} style={styles.modalImage} />
              <Text style={styles.modalDescription}>
                {`གོང་ཚད་ : ${selectedBorder.cost}`}
              </Text>
              <Text style={styles.modalDescription}>
                {selectedBorder.is_purchased
                  ? 'ཨ་ནཱི་ས་མཚམས་འདི་ ཉོ་མི་ཨིན།'
                  : 'ཨ་ནཱི་ས་མཚམས་འདི་ ཉོ་མི་མེན།'}
              </Text>
              <View style={styles.modalButtons}>
                {!selectedBorder.is_purchased && (
                  <Button title="Buy" onPress={handleBuyBorder} />
                )}
                {selectedBorder.is_purchased &&
                  selectedBorder.id !== currentAvatarBorder && (
                    <Button title="Equip" onPress={handleEquipBorder} />
                  )}
                <View style={styles.closebtn}>
                  <Button
                    title="Close"
                    onPress={() => setModalVisible(false)}
                  />
                </View>
              </View>
            </View>
          </View>
        </Modal>
      )}
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
    height: '150%',
    resizeMode: 'stretch',
  },
  flatListStyle: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    width: '100%',
    height: '100%',
    marginTop: '8%',
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
    height: '70%',
    resizeMode: 'contain',
  },
  purchasedBorder: {
    borderColor: 'gold',
    borderWidth: 2,
  },
  unpurchasedBorder: {
    opacity: 0.5,
  },
  borderName: {
    marginTop: 5,
    fontSize: 16,
  },
  borderCost: {
    fontSize: 14,
    color: 'gray',
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
    fontFamily: 'joyig',
    fontSize: height * 0.12,
  },
  modalImage: {
    width: 70,
    height: 70,
    resizeMode: 'contain',
    marginBottom: 2,
  },
  modalDescription: {
    fontSize: height * 0.09,
    fontFamily: 'joyig',
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: '30%',
    padding: 10,
  },
  closebtn: {
    borderRadius: '10%',
    backgroundColor: 'red',
  },
  equippedBorder: {
    borderColor: 'green',
    borderWidth: 3,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AvatarScreen;
