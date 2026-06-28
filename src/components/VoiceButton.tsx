import React from 'react';
import { TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { colors } from '../utils/colors';

interface Props {
  isListening: boolean;
  onPress: () => void;
}

export default function VoiceButton({ isListening, onPress }: Props) {
  const [scale] = React.useState(new Animated.Value(1));

  React.useEffect(() => {
    if (isListening) {
      const anim = Animated.loop(
        Animated.sequence([
          Animated.timing(scale, { toValue: 1.15, duration: 800, useNativeDriver: true }),
          Animated.timing(scale, { toValue: 1, duration: 800, useNativeDriver: true }),
        ])
      );
      anim.start();
      return () => anim.stop();
    } else {
      scale.setValue(1);
    }
  }, [isListening, scale]);

  return (
    <TouchableOpacity
      style={[styles.button, isListening && styles.listening]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Animated.View style={{ transform: [{ scale }] }}>
        <Icon
          name={isListening ? 'microphone' : 'microphone-outline'}
          size={48}
          color={isListening ? '#fff' : colors.primary}
        />
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: colors.card,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 2,
    borderColor: colors.border,
  },
  listening: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
});
