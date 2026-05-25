import React from "react";
import { View, Text, StyleSheet, SafeAreaView } from "react-native";
import { useRouter } from "expo-router";
import {
  ChevronLeft,
  Warehouse,
  ArrowUpCircle,
  ArrowDownCircle,
} from "lucide-react-native";
import { Colores, Tipografia, Espaciado } from "../src/constantes/tema";
import BotonAnimado from "../src/componentes/ui/BotonAnimado";
import { useEstadoCasa } from "../src/estado/ContextoCasa";
import { publicarComandoPorton } from "../src/servicios/servicio-mqtt";

export default function PantallaCochera() {
  const router = useRouter();
  const { portonAbierto, actualizarPorton } = useEstadoCasa();

  const ejecutarAccionPorton = () => {
    const nuevaAccion = portonAbierto ? "cerrar" : "abrir";
    actualizarPorton(!portonAbierto);
    publicarComandoPorton(nuevaAccion);
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
        <Text style={estilos.textoTitulo}>Control Cochera</Text>
        <View style={{ width: 32 }} />
      </View>

      <View style={estilos.contenedorContenido}>
        {/* ÍCONO INDICADOR */}
        <View
          style={[
            estilos.contenedorIcono,
            { backgroundColor: portonAbierto ? "#4CAF50" : "#1A243A" },
          ]}
        >
          <Warehouse color={Colores.textoSecundario} size={80} />
        </View>

        <Text style={estilos.textoEstado}>
          Portón:{" "}
          <Text
            style={{
              color: portonAbierto ? "#4CAF50" : Colores.textoPrincipal,
            }}
          >
            {portonAbierto ? "ABIERTO" : "CERRADO"}
          </Text>
        </Text>

        <BotonAnimado
          estilo={[
            estilos.botonAccion,
            {
              backgroundColor: portonAbierto
                ? "#E53935"
                : Colores.botonEncendido,
            },
          ]}
          onPress={ejecutarAccionPorton}
        >
          {portonAbierto ? (
            <ArrowDownCircle color={Colores.textoSecundario} size={32} />
          ) : (
            <ArrowUpCircle color={Colores.textoSecundario} size={32} />
          )}
          <Text style={estilos.textoBoton}>
            {portonAbierto ? "CERRAR PORTÓN" : "ABRIR PORTÓN"}
          </Text>
        </BotonAnimado>
      </View>
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
  contenedorContenido: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: Espaciado.extragrande,
  },
  contenedorIcono: {
    padding: Espaciado.extragrande,
    borderRadius: 40,
    marginBottom: Espaciado.extragrande,
  },
  textoEstado: {
    color: Colores.textoPrincipal,
    fontSize: Tipografia.tamanos.titulo,
    fontWeight: Tipografia.pesos.negrita,
    marginBottom: Espaciado.extragrande,
  },
  botonAccion: {
    flexDirection: "row",
    width: "100%",
    padding: Espaciado.grande,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    gap: Espaciado.mediano,
  },
  textoBoton: {
    color: Colores.textoSecundario,
    fontSize: Tipografia.tamanos.subtitulo,
    fontWeight: Tipografia.pesos.negrita,
  },
});
