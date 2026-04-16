import { StyleSheet, Text, View } from 'react-native';
import { Colors } from '../../constants/colors';
import { FontSize, FontWeight } from '../../constants/typography';

export default function PlayScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Daily Play</Text>
      <Text style={styles.subtitle}>Your memory game for today will appear here.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  title: {
    color: Colors.textPrimary,
    fontSize: FontSize['2xl'],
    fontWeight: FontWeight.bold,
    marginBottom: 8,
  },
  subtitle: {
    color: Colors.textSecondary,
    fontSize: FontSize.md,
    textAlign: 'center',
  },
});
