// src/componentes/ui/SwitchPersonalizado.tsx

import React, { useEffect } from 'react';
import { Pressable, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolateColor,
} from 'react-native-reanimated';
import { Colores } from '../../constantes/tema';

interface SwitchPersonalizadoProps {
  activo: boolean;
  alCambiar: (nuevoEstado: boolean) => void;
  estilo?: StyleProp<ViewStyle>;
}

export default function SwitchPersonalizado({ activo, alCambiar, estilo }: SwitchPersonalizadoProps) {
  // Shared value para la animación: 0 es apagado, 1 es encendido
  const progreso = useSharedValue(activo ? 1 : 0);

  // Cada vez que cambia la propiedad 'activo' (ej. por MQTT o por toque del usuario), 
  // animamos el valor suavemente.
  useEffect(() => {
    progreso.value = withTiming(activo ? 1 : 0, { duration: 250 });
  }, [activo]);

  // Animación del fondo de la pista (Track)
  const estiloPista = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      progreso.value,
      [0, 1],
      [Colores.switchPistaApagado, Colores.switchPistaEncendido]
    );

    return { backgroundColor };
  });

  // Animación de desplazamiento de la bolita (Thumb)
  const estiloBolita = useAnimatedStyle(() => {
    // La pista mide 50 de ancho, la bolita 24, y hay 2 de padding a cada lado.
    // Recorrido total: 50 - 24 - (2 * 2) = 22 píxeles
    const desplazamientoX = progreso.value * 22;

    return {
      transform: [{ translateX: desplazamientoX }],
    };
  });

  return (
    <Pressable 
      onPress={() => alCambiar(!activo)} 
      hitSlop={10} // Amplía el área táctil para que sea más fácil de presionar
      style={estilo}
    >
      <Animated.View style={[estilos.pista, estiloPista]}>
        <Animated.View style={[estilos.bolita, estiloBolita]} />
      </Animated.View>
    </Pressable>
  );
}

const estilos = StyleSheet.create({
  pista: {
    width: 50,
    height: 28,
    borderRadius: 16,
    padding: 2,
    justifyContent: 'center',
  },
  bolita: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colores.switchBolita,
    // Pequeña sombra para darle relieve
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2.5,
    elevation: 3, 
  },
});