// src/componentes/configuracion/Paso2Dashboard.tsx
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Home, Wifi, Trash2 } from "lucide-react-native";
import { Colores, Tipografia, Espaciado } from "../../constantes/tema";
import BotonAnimado from "../ui/BotonAnimado";

interface Props {
  redActualESP: string;
  iniciarEscaneoWifi: () => void;
  formatearESP: () => void;
}

export default function Paso2Dashboard({
  redActualESP,
  iniciarEscaneoWifi,
  formatearESP,
}: Props) {
  return (
    <View style={estilos.contenedorPaso}>
      <View style={estilos.circuloIcono}>
        <Home color={Colores.textoSecundario} size={48} />
      </View>
      <Text style={estilos.textoInstruccion}>
        Casa conectada.
      </Text>

      <View style={estilos.tarjetaEstadoActual}>
        <Text style={estilos.textoEtiquetaEstado}>Red actual de la casa:</Text>
        <Text style={estilos.textoValorEstado}>{redActualESP}</Text>
      </View>

      <BotonAnimado estilo={estilos.botonPrimario} onPress={iniciarEscaneoWifi}>
        <Wifi color={Colores.textoSecundario} size={20} />
        <Text style={[estilos.textoBotonPrimario, { marginLeft: 8 }]}>
          Configurar Nueva Red
        </Text>
      </BotonAnimado>

      <BotonAnimado estilo={estilos.botonPeligro} onPress={formatearESP}>
        <Trash2 color="#FFF" size={20} />
        <Text
          style={[estilos.textoBotonPrimario, { color: "#FFF", marginLeft: 8 }]}
        >
          Formatear de Fábrica
        </Text>
      </BotonAnimado>
    </View>
  );
}

const estilos = StyleSheet.create({
  contenedorPaso: { alignItems: "center", width: "100%" },
  circuloIcono: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: Colores.fondoTarjetasClaras,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Espaciado.grande,
  },
  textoInstruccion: {
    color: Colores.textoPrincipal,
    fontSize: Tipografia.tamanos.cuerpo,
    textAlign: "center",
    marginBottom: Espaciado.mediano,
    lineHeight: 22,
  },
  tarjetaEstadoActual: {
    backgroundColor: "#1A243A",
    width: "100%",
    padding: Espaciado.mediano,
    borderRadius: 16,
    alignItems: "center",
    marginBottom: Espaciado.extragrande,
  },
  textoEtiquetaEstado: {
    color: Colores.textoPrincipal,
    fontSize: Tipografia.tamanos.cuerpo,
    opacity: 0.8,
    marginBottom: 4,
  },
  textoValorEstado: {
    color: "#4CAF50",
    fontSize: Tipografia.tamanos.subtitulo,
    fontWeight: Tipografia.pesos.negrita,
  },
  botonPrimario: {
    flexDirection: "row",
    backgroundColor: Colores.botonEncendido,
    width: "100%",
    padding: Espaciado.mediano,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  botonPeligro: {
    flexDirection: "row",
    backgroundColor: "#E53935",
    width: "100%",
    padding: Espaciado.mediano,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginTop: Espaciado.mediano,
  },
  textoBotonPrimario: {
    color: Colores.textoSecundario,
    fontSize: Tipografia.tamanos.subtitulo,
    fontWeight: Tipografia.pesos.negrita,
  },
});
