import { StyleSheet, Text, View } from 'react-native';
import { Colors } from '../../constants/colors';
import { FontSize, FontWeight } from '../../constants/typography';

export default function HistoryScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Score History</Text>
      <Text style={styles.subtitle}>Your past game results and streaks will appear here.</Text>
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
