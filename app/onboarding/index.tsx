import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { router } from 'expo-router';
import { Colors } from '../../constants/colors';
import { FontSize, FontWeight } from '../../constants/typography';

export default function OnboardingWelcome() {
  return (
    <View style={styles.container}>
      <Text style={styles.wordmark}>Refsurface</Text>
      <Text style={styles.tagline}>Rediscover the photos you forgot you loved.</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push('/onboarding/permissions')}
        activeOpacity={0.8}
      >
        <Text style={styles.buttonLabel}>Get Started</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  wordmark: {
    color: Colors.accent,
    fontSize: FontSize['3xl'],
    fontWeight: FontWeight.bold,
    marginBottom: 16,
    letterSpacing: -0.5,
  },
  tagline: {
    color: Colors.textSecondary,
    fontSize: FontSize.lg,
    textAlign: 'center',
    lineHeight: FontSize.lg * 1.5,
    marginBottom: 64,
  },
  button: {
    backgroundColor: Colors.accent,
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: 12,
  },
  buttonLabel: {
    color: Colors.background,
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
  },
});
