import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { ChevronLeft, Waves, Clock, Edit3 } from "lucide-react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

import { Colores, Tipografia, Espaciado } from "../src/constantes/tema";
import BotonAnimado from "../src/componentes/ui/BotonAnimado";
import SwitchPersonalizado from "../src/componentes/ui/SwitchPersonalizado";
import { useEstadoCasa } from "../src/estado/ContextoCasa";
import { publicarComandoParedLlorosa } from "../src/servicios/servicio-mqtt";
import Toast from "react-native-toast-message";

const crearFechaDeHora = (horaString: string) => {
  if (!horaString || !horaString.includes(":")) return new Date();

  const [h, m] = horaString.split(":");
  const fecha = new Date();
  fecha.setHours(parseInt(h, 10), parseInt(m, 10), 0, 0);
  return fecha;
};

const formatearHoraInterna = (fecha: Date) => {
  const h = fecha.getHours().toString().padStart(2, "0");
  const m = fecha.getMinutes().toString().padStart(2, "0");
  return `${h}:${m}`;
};

const formatearHoraVisible = (horaString24h: string) => {
  if (!horaString24h || !horaString24h.includes(":")) return "--:--";

  const [hStr, mStr] = horaString24h.split(":");
  let horas = parseInt(hStr, 10);
  const ampm = horas >= 12 ? "PM" : "AM";

  horas = horas % 12;
  horas = horas ? horas : 12;

  const horaFormateada = horas.toString().padStart(2, "0");
  return `${horaFormateada}:${mStr} ${ampm}`;
};

export default function PantallaParedLlorosa() {
  const router = useRouter();
  const { paredLlorosa, actualizarParedLlorosa } = useEstadoCasa();

  const [horaInicio, setHoraInicio] = useState(paredLlorosa.horaEncendido);
  const [horaFin, setHoraFin] = useState(paredLlorosa.horaApagado);

  const [mostrarPickerInicio, setMostrarPickerInicio] = useState(false);
  const [mostrarPickerFin, setMostrarPickerFin] = useState(false);

  const alternarPared = (nuevoEstado: boolean) => {
    actualizarParedLlorosa(
      nuevoEstado,
      paredLlorosa.horaEncendido,
      paredLlorosa.horaApagado,
    );
    publicarComandoParedLlorosa(nuevoEstado ? "encender" : "apagar");
  };

  const manejarCambioInicio = (event: any, fechaSeleccionada?: Date) => {
    if (Platform.OS === "android") {
      setMostrarPickerInicio(false);
    }

    if (event.type === "dismissed" || !fechaSeleccionada) {
      return;
    }

    setHoraInicio(formatearHoraInterna(fechaSeleccionada));
  };

  const manejarCambioFin = (event: any, fechaSeleccionada?: Date) => {
    if (Platform.OS === "android") {
      setMostrarPickerFin(false);
    }

    if (event.type === "dismissed" || !fechaSeleccionada) {
      return;
    }

    setHoraFin(formatearHoraInterna(fechaSeleccionada));
  };

  const guardarProgramacion = () => {
    actualizarParedLlorosa(paredLlorosa.estado, horaInicio, horaFin);
    publicarComandoParedLlorosa("programar", horaInicio, horaFin);
    Toast.show({
      type: "success",
      text1: "¡Horario Guardado!",
      text2: "La pared llorosa operará en el horario establecido.",
    });
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
        <Text style={estilos.textoTitulo}>Pared Llorosa</Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView
        contentContainerStyle={estilos.contenedorContenido}
        showsVerticalScrollIndicator={false}
      >
        <View style={estilos.tarjetaPrincipal}>
          <View
            style={[
              estilos.contenedorIcono,
              { backgroundColor: paredLlorosa.estado ? "#2196F3" : "#1A243A" },
            ]}
          >
            <Waves color={Colores.textoSecundario} size={64} />
          </View>
          <Text style={estilos.textoEstado}>
            Motor:{" "}
            <Text
              style={{
                color: paredLlorosa.estado ? "#2196F3" : Colores.textoPrincipal,
              }}
            >
              {paredLlorosa.estado ? "ENCENDIDO" : "APAGADO"}
            </Text>
          </Text>
          <SwitchPersonalizado
            activo={paredLlorosa.estado}
            alCambiar={alternarPared}
          />
        </View>

        <Text style={estilos.tituloSeccion}>PROGRAMACIÓN AUTOMÁTICA</Text>

        <View style={estilos.tarjetaProgramacion}>
          <View style={estilos.encabezadoProgramacion}>
            <Clock color={Colores.textoSecundario} size={24} />
            <Text style={estilos.textoSubtitulo}>Configurar Horario</Text>
          </View>

          <View style={estilos.filaInputs}>
            <View style={estilos.columnaInput}>
              <Text style={estilos.etiquetaInput}>Encender a las:</Text>
              <BotonAnimado
                estilo={estilos.botonHora}
                onPress={() => setMostrarPickerInicio(true)}
              >
                <Text style={estilos.textoHora}>
                  {formatearHoraVisible(horaInicio)}
                </Text>
                <Edit3
                  color={Colores.textoPrincipal}
                  size={16}
                  style={{ marginLeft: 8, opacity: 0.5 }}
                />
              </BotonAnimado>

              {mostrarPickerInicio && (
                <DateTimePicker
                  value={crearFechaDeHora(horaInicio)}
                  mode="time"
                  is24Hour={false}
                  display="spinner"
                  onChange={manejarCambioInicio}
                  textColor={Colores.textoSecundario}
                />
              )}
            </View>

            <View style={estilos.columnaInput}>
              <Text style={estilos.etiquetaInput}>Apagar a las:</Text>
              <BotonAnimado
                estilo={estilos.botonHora}
                onPress={() => setMostrarPickerFin(true)}
              >
                <Text style={estilos.textoHora}>
                  {formatearHoraVisible(horaFin)}
                </Text>
                <Edit3
                  color={Colores.textoPrincipal}
                  size={16}
                  style={{ marginLeft: 8, opacity: 0.5 }}
                />
              </BotonAnimado>

              {mostrarPickerFin && (
                <DateTimePicker
                  value={crearFechaDeHora(horaFin)}
                  mode="time"
                  is24Hour={false}
                  display="spinner"
                  onChange={manejarCambioFin}
                  textColor={Colores.textoSecundario}
                />
              )}
            </View>
          </View>

          <BotonAnimado
            estilo={estilos.botonGuardar}
            onPress={guardarProgramacion}
          >
            <Text style={estilos.textoBotonGuardar}>Guardar Programación</Text>
          </BotonAnimado>
        </View>
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
  contenedorContenido: { padding: Espaciado.grande },

  tarjetaPrincipal: {
    backgroundColor: Colores.fondoTarjetasOscuras,
    alignItems: "center",
    padding: Espaciado.extragrande,
    borderRadius: 24,
    marginBottom: Espaciado.extragrande,
  },
  contenedorIcono: {
    padding: Espaciado.extragrande,
    borderRadius: 40,
    marginBottom: Espaciado.grande,
  },
  textoEstado: {
    color: Colores.textoPrincipal,
    fontSize: Tipografia.tamanos.subtitulo,
    fontWeight: Tipografia.pesos.negrita,
    marginBottom: Espaciado.grande,
  },

  tituloSeccion: {
    color: Colores.textoPrincipal,
    fontSize: Tipografia.tamanos.subtitulo,
    fontWeight: Tipografia.pesos.negrita,
    marginBottom: Espaciado.mediano,
  },
  tarjetaProgramacion: {
    backgroundColor: Colores.fondoTarjetasClaras,
    padding: Espaciado.grande,
    borderRadius: 24,
  },
  encabezadoProgramacion: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Espaciado.grande,
    gap: Espaciado.pequeno,
  },
  textoSubtitulo: {
    color: Colores.textoSecundario,
    fontSize: Tipografia.tamanos.cuerpo,
    fontWeight: Tipografia.pesos.negrita,
  },

  filaInputs: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: Espaciado.grande,
  },
  columnaInput: { width: "48%" },
  etiquetaInput: {
    color: Colores.textoSecundario,
    fontSize: Tipografia.tamanos.etiqueta,
    fontWeight: Tipografia.pesos.negrita,
    marginBottom: 8,
    marginLeft: 4,
  },

  botonHora: {
    flexDirection: "row",
    backgroundColor: Colores.inputFondo || "#1A243A",
    padding: Espaciado.mediano,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    height: 60,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  textoHora: {
    color: Colores.textoSecundario,
    fontSize: Tipografia.tamanos.cuerpo,
    fontWeight: Tipografia.pesos.negrita,
  },

  botonGuardar: {
    backgroundColor: Colores.fondoPrincipal,
    paddingVertical: Espaciado.grande,
    paddingHorizontal: Espaciado.mediano,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginTop: Espaciado.mediano,
    shadowColor: Colores.botonEncendido,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
  },
  textoBotonGuardar: {
    color: Colores.fondoTarjetasClaras,
    fontSize: Tipografia.tamanos.subtitulo,
    fontWeight: Tipografia.pesos.negrita,
    letterSpacing: 0.5,
  },
});
