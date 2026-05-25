import React from "react";
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from "react-native";
import { useRouter } from "expo-router";
import { ChevronLeft, Lightbulb } from "lucide-react-native";
import Slider from "@react-native-community/slider";
import { Colores, Tipografia, Espaciado } from "../src/constantes/tema";
import BotonAnimado from "../src/componentes/ui/BotonAnimado";
import SwitchPersonalizado from "../src/componentes/ui/SwitchPersonalizado";
import { useEstadoCasa } from "../src/estado/ContextoCasa";
import { publicarComandoLuz } from "../src/servicios/servicio-mqtt";

const formatearNombreHabitacion = (nombre: string) => {
  const diccionarioNombres: { [key: string]: string } = {
    bano: "Baño",
    jardin: "Jardín",
    porton: "Portón",
  };

  const nombreFormateado =
    diccionarioNombres[nombre] ||
    nombre.charAt(0).toUpperCase() + nombre.slice(1);

  return nombreFormateado.toUpperCase();
};

export default function PantallaLuces() {
  const router = useRouter();
  const { luces, actualizarLuz } = useEstadoCasa();

  const manejarCambioLuz = (habitacion: string, estado: boolean) => {
    actualizarLuz(habitacion, estado);
    publicarComandoLuz(habitacion, estado);
  };

  const manejarCambioBrillo = (habitacion: string, brillo: number) => {
    const brilloEntero = Math.round(brillo);
    actualizarLuz(habitacion, luces[habitacion].estado, brilloEntero);
    publicarComandoLuz(habitacion, luces[habitacion].estado, brilloEntero);
  };

  return (
    <SafeAreaView style={estilos.contenedorSafe}>
      <View style={estilos.header}>
        <BotonAnimado
          onPress={() => router.back()}
          estilo={estilos.botonRetroceso}
        >
          <ChevronLeft color={Colores.textoPrincipal} size={32} />
        </BotonAnimado>
        <Text style={estilos.textoTitulo}>Control de Luces</Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView contentContainerStyle={estilos.contenedorScroll}>
        {Object.entries(luces).map(([habitacion, info]) => (
          <View key={habitacion} style={estilos.tarjetaLuz}>
            <View style={estilos.filaPrincipal}>
              <View style={estilos.filaInfo}>
                <Lightbulb
                  color={info.estado ? "#FDD835" : Colores.textoSecundario}
                  size={24}
                />
                <Text style={estilos.textoHabitacion}>
                  {formatearNombreHabitacion(habitacion)}
                </Text>
              </View>
              <SwitchPersonalizado
                activo={info.estado}
                alCambiar={(val) => manejarCambioLuz(habitacion, val)}
              />
            </View>

            {info.estado && (
              <View style={estilos.contenedorSlider}>
                <Text style={estilos.textoBrillo}>
                  Brillo: {Math.round(info.brillo)}%
                </Text>
                <Slider
                  style={{ width: "100%", height: 40 }}
                  minimumValue={0}
                  maximumValue={100}
                  step={1}
                  value={info.brillo}
                  onSlidingComplete={(val) =>
                    manejarCambioBrillo(habitacion, val)
                  }
                  minimumTrackTintColor={Colores.botonEncendido}
                  maximumTrackTintColor={Colores.fondoTarjetasClaras}
                  thumbTintColor={Colores.textoPrincipal}
                />
              </View>
            )}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  contenedorSafe: {
    flex: 1,
    backgroundColor: Colores.fondoPrincipal,
    paddingVertical: 30,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: Espaciado.grande,
  },
  botonRetroceso: { padding: Espaciado.pequeno },
  textoTitulo: {
    color: Colores.textoPrincipal,
    fontSize: Tipografia.tamanos.subtitulo,
    fontWeight: Tipografia.pesos.negrita,
  },
  contenedorScroll: { padding: Espaciado.grande },
  tarjetaLuz: {
    backgroundColor: Colores.fondoTarjetasOscuras,
    padding: Espaciado.mediano,
    borderRadius: 16,
    marginBottom: Espaciado.mediano,
  },
  filaPrincipal: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  filaInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: Espaciado.pequeno,
  },
  textoHabitacion: {
    color: Colores.textoPrincipal,
    fontSize: Tipografia.tamanos.cuerpo,
    fontWeight: Tipografia.pesos.negrita,
  },
  contenedorSlider: { marginTop: Espaciado.mediano },
  textoBrillo: {
    color: Colores.textoSecundario,
    fontSize: Tipografia.tamanos.etiqueta,
    marginBottom: 4,
  },
});
