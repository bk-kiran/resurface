import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { router } from 'expo-router';
import { Colors } from '../../constants/colors';
import { FontSize, FontWeight } from '../../constants/typography';

export default function PermissionsScreen() {
  const handleAllow = () => {
    // TODO: call MediaLibrary.requestPermissionsAsync() here
    router.push('/onboarding/scanning');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Access Your Library</Text>
      <Text style={styles.body}>
        Refsurface reads your photo library to surface memories — nothing is uploaded or shared.
      </Text>

      <TouchableOpacity style={styles.primaryButton} onPress={handleAllow} activeOpacity={0.8}>
        <Text style={styles.primaryLabel}>Allow Access</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.ghostButton} onPress={() => router.back()} activeOpacity={0.7}>
        <Text style={styles.ghostLabel}>Not Now</Text>
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
  heading: {
    color: Colors.textPrimary,
    fontSize: FontSize['2xl'],
    fontWeight: FontWeight.bold,
    textAlign: 'center',
    marginBottom: 16,
  },
  body: {
    color: Colors.textSecondary,
    fontSize: FontSize.md,
    textAlign: 'center',
    lineHeight: FontSize.md * 1.6,
    marginBottom: 48,
  },
  primaryButton: {
    backgroundColor: Colors.accent,
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: 12,
    marginBottom: 16,
    width: '100%',
    alignItems: 'center',
  },
  primaryLabel: {
    color: Colors.background,
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
  },
  ghostButton: {
    paddingVertical: 12,
  },
  ghostLabel: {
    color: Colors.textDisabled,
    fontSize: FontSize.sm,
  },
});
