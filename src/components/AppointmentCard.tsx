import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

type Props = {
  clientName: string;
  service: string;
  time: string;
}

export default function AppointmentCard({ clientName, service, time }: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{clientName}</Text>
      <Text>{service}</Text>
      <Text>{time}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFF0F5',
    padding: 15,
    marginVertical: 10,
    borderRadius: 10,
    elevation: 3,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
  },
});