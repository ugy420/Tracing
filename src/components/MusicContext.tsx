import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from 'react';
import Sound from 'react-native-sound';
import {Platform} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define the shape of our context
interface MusicContextType {
  volume: number;
  isMuted: boolean;
  updateVolume: (newVolume: number) => void;
  toggleMute: () => void;
}

// Create context with default values
const MusicContext = createContext<MusicContextType>({
  volume: 0.7,
  isMuted: false,
  updateVolume: () => {},
  toggleMute: () => {},
});

// Storage key for volume settings
const VOLUME_STORAGE_KEY = '@app_music_volume';

interface MusicProviderProps {
  children: ReactNode;
  backgroundTrack?: string; // Optional prop to specify which track to play
}

export const MusicProvider: React.FC<MusicProviderProps> = ({
  children,
  backgroundTrack = 'dummy_music', // Default track name
}) => {
  const [backgroundMusic, setBackgroundMusic] = useState<Sound | null>(null);
  const [volume, setVolume] = useState<number>(0.7);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  // Load saved volume settings
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const savedVolume = await AsyncStorage.getItem(VOLUME_STORAGE_KEY);

        if (savedVolume !== null) {
          setVolume(parseFloat(savedVolume));
        }

        setIsInitialized(true);
      } catch (e) {
        console.error('Failed to load volume settings', e);
        setIsInitialized(true);
      }
    };

    loadSettings();
  }, []);

  // Initialize and play background music once settings are loaded
  useEffect(() => {
    if (!isInitialized) {
      return;
    }

    // Sound configuration
    Sound.setCategory('Playback', false);

    const soundPath =
      Platform.OS === 'android'
        ? backgroundTrack // File name in the raw folder (without extension)
        : `${backgroundTrack}.mp3`; // iOS needs extension

    // Initialize background music
    const music = new Sound(
      soundPath,
      Platform.OS === 'android' ? Sound.MAIN_BUNDLE : '',
      error => {
        if (error) {
          console.log('Failed to load the sound', error);
          return;
        }

        // Apply saved volume
        music.setVolume(isMuted ? 0 : volume);

        // Loop indefinitely
        music.setNumberOfLoops(-1);

        // Start playing automatically
        music.play((success: boolean) => {
          if (!success) {
            console.log('Playback failed due to audio decoding errors');
          }
        });
      },
    );

    setBackgroundMusic(music);

    // Cleanup on unmount
    return () => {
      if (music) {
        music.stop();
        music.release();
      }
    };
  }, [isInitialized, backgroundTrack, isMuted, volume]);

  // Apply volume changes to the sound
  useEffect(() => {
    if (backgroundMusic && isInitialized) {
      backgroundMusic.setVolume(isMuted ? 0 : volume);

      // Save settings to persistent storage
      try {
        AsyncStorage.setItem(VOLUME_STORAGE_KEY, volume.toString());
      } catch (e) {
        console.error('Failed to save volume settings', e);
      }
    }
  }, [volume, backgroundMusic, isInitialized, isMuted]);

  const toggleMute = () => {
    setIsMuted(prev => !prev);
  };

  // Update volume function
  const updateVolume = (newVolume: number) => {
    setVolume(newVolume);
  };

  const contextValue: MusicContextType = {
    volume,
    isMuted,
    updateVolume,
    toggleMute,
  };

  return (
    <MusicContext.Provider value={contextValue}>
      {children}
    </MusicContext.Provider>
  );
};

// Custom hook to use the music context
export const useMusic = (): MusicContextType => useContext(MusicContext);
