import { StyleSheet, Text, View } from 'react-native';
import { Colors } from '../../constants/colors';
import { FontSize, FontWeight } from '../../constants/typography';

export default function ScanningScreen() {
  // TODO: kick off MediaLibrary.getAssetsAsync() pagination and drive progress state here.
  const progress = 0; // 0–1

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Scanning Library…</Text>
      <Text style={styles.subheading}>This only happens once.</Text>

      <View style={styles.trackOuter}>
        <View style={[styles.trackInner, { width: `${Math.round(progress * 100)}%` }]} />
      </View>

      <Text style={styles.caption}>{Math.round(progress * 100)}% complete</Text>
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
    fontSize: FontSize.xl,
    fontWeight: FontWeight.semibold,
    marginBottom: 8,
  },
  subheading: {
    color: Colors.textSecondary,
    fontSize: FontSize.sm,
    marginBottom: 40,
  },
  trackOuter: {
    width: '100%',
    height: 6,
    backgroundColor: Colors.surfaceRaised,
    borderRadius: 3,
    overflow: 'hidden',
  },
  trackInner: {
    height: '100%',
    backgroundColor: Colors.accent,
    borderRadius: 3,
  },
  caption: {
    color: Colors.textDisabled,
    fontSize: FontSize.xs,
    marginTop: 12,
  },
});
