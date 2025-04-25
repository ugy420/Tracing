import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import Sound from 'react-native-sound';
import { Platform } from 'react-native';

// Define the shape of our context
interface MusicContextType {
  volume: number;
  updateVolume: (newVolume: number) => void;
}

// Create context with default values
const MusicContext = createContext<MusicContextType>({
  volume: 0.5,
  updateVolume: () => {},
});

interface MusicProviderProps {
  children: ReactNode;
}

export const MusicProvider: React.FC<MusicProviderProps> = ({ children }) => {
  const [backgroundMusic, setBackgroundMusic] = useState<Sound | null>(null);
  const [volume, setVolume] = useState<number>(0.5);

  useEffect(() => {
    // Sound configuration for Android
    Sound.setCategory('Playback', false); // false means sound will respect phone's silent mode

    // For Android, we need to specify the location of the sound file
    const soundPath = Platform.OS === 'android' 
      ? 'dummy_music.mp3' // File name in the raw folder
      : 'dummy_music.mp3'; // iOS fallback

    // Initialize background music
    const music = new Sound(
      soundPath,
      Platform.OS === 'android' ? Sound.MAIN_BUNDLE : Sound.MAIN_BUNDLE,
      (error) => {
        if (error) {
          console.log('Failed to load the sound', error);
          return;
        }
        
        // Set initial volume
        music.setVolume(volume);
        
        // Loop indefinitely
        music.setNumberOfLoops(-1);
        
        // Start playing automatically
        music.play((success: boolean) => {
          if (!success) {
            console.log('Playback failed due to audio decoding errors');
          }
        });
      }
    );

    setBackgroundMusic(music);

    // Cleanup on unmount
    return () => {
      if (music) {
        music.stop();
        music.release();
      }
    };
  }, []);

  // Update volume function
  const updateVolume = (newVolume: number) => {
    setVolume(newVolume);
    if (backgroundMusic) {
      backgroundMusic.setVolume(newVolume);
    }
  };

  const contextValue: MusicContextType = {
    volume,
    updateVolume,
  };

  return (
    <MusicContext.Provider value={contextValue}>
      {children}
    </MusicContext.Provider>
  );
};

// Custom hook to use the music context
export const useMusic = (): MusicContextType => useContext(MusicContext);