import React from "react";
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from "react-native";
import { useRouter } from "expo-router";
import { Wifi, Lightbulb, Warehouse, Waves } from "lucide-react-native";
import { Colores, Tipografia, Espaciado } from "../src/constantes/tema";
import BotonAnimado from "../src/componentes/ui/BotonAnimado";
import SwitchPersonalizado from "../src/componentes/ui/SwitchPersonalizado";

import { useEstadoCasa } from "../src/estado/ContextoCasa";
import {
  publicarComandoLuz,
  publicarComandoPorton,
  publicarComandoParedLlorosa,
} from "../src/servicios/servicio-mqtt";

export default function PantallaInicio() {
  const router = useRouter();

  const {
    luces,
    portonAbierto,
    paredLlorosa,
    dispositivoConectado,
    actualizarLuz,
    actualizarPorton,
    actualizarParedLlorosa,
  } = useEstadoCasa();
  const estadoPared = paredLlorosa.estado;

  const algunaLuzEncendida = Object.values(luces).some(
    (luz) => luz?.estado === true,
  );

  const alternarLucesMaestro = (nuevoEstado: boolean) => {
    Object.keys(luces).forEach((habitacion) =>
      actualizarLuz(habitacion, nuevoEstado),
    );
    publicarComandoLuz("todas", nuevoEstado);
  };

  const alternarCochera = (nuevoEstado: boolean) => {
    actualizarPorton(nuevoEstado);
    publicarComandoPorton(nuevoEstado ? "abrir" : "cerrar");
  };

  const alternarParedLlorosa = (nuevoEstado: boolean) => {
    actualizarParedLlorosa(nuevoEstado);
    publicarComandoParedLlorosa(nuevoEstado ? "encender" : "apagar");
  };

  return (
    <SafeAreaView style={estilos.contenedorSafe}>
      <ScrollView
        contentContainerStyle={estilos.contenedorScroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={estilos.header}>
          <View>
            <Text style={estilos.textoBienvenido}>Bienvenido</Text>
            <Text style={estilos.textoNombre}>David</Text>

            {/* AQUÍ ESTÁ EL INDICADOR DE RED MEJORADO */}
            <View style={estilos.contenedorIndicador}>
              <View
                style={[
                  estilos.puntoIndicador,
                  {
                    backgroundColor: dispositivoConectado
                      ? "#4CAF50"
                      : "#E53935",
                  },
                ]}
              />
              <Text
                style={[
                  estilos.indicadorRed,
                  {
                    color: dispositivoConectado
                      ? "#4CAF50"
                      : Colores.textoSecundario,
                  },
                ]}
              >
                {dispositivoConectado ? "Casa en línea" : "Casa desconectada"}
              </Text>
            </View>
          </View>
          <BotonAnimado
            estilo={estilos.botonConectar}
            onPress={() => router.push("/configuracion")}
          >
            <Wifi color={Colores.textoSecundario} size={24} />
            <Text style={estilos.textoBotonConectar}>CONFIGURAR</Text>
          </BotonAnimado>
        </View>

        <BotonAnimado estilo={estilos.tarjetaProgramado}>
          <Text style={estilos.textoProgramadoTitulo}>Programado</Text>
          <Text style={estilos.textoProgramadoSubtitulo}>PARED JARDIN</Text>
        </BotonAnimado>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={estilos.carrusel}
        >
          <BotonAnimado
            estilo={[estilos.tarjetaZona, { backgroundColor: "#1A243A" }]}
          >
            <Text style={estilos.textoZona}>SALA</Text>
          </BotonAnimado>
          <BotonAnimado
            estilo={[estilos.tarjetaZona, { backgroundColor: "#1A243A" }]}
          >
            <Text style={estilos.textoZona}>JARDIN</Text>
          </BotonAnimado>
        </ScrollView>

        <Text style={estilos.tituloSeccion}>DISPOSITIVOS</Text>

        <View style={estilos.gridDispositivos}>
          <BotonAnimado
            estilo={estilos.tarjetaDispositivo}
            onPress={() => router.push("/luces")}
          >
            <View style={estilos.tarjetaHeader}>
              <Text style={estilos.textoDispositivo}>LUCES</Text>
              <Lightbulb color={Colores.textoSecundario} size={28} />
            </View>
            <View style={estilos.tarjetaFooter}>
              <SwitchPersonalizado
                activo={algunaLuzEncendida}
                alCambiar={alternarLucesMaestro}
              />
            </View>
          </BotonAnimado>

          <BotonAnimado
            estilo={estilos.tarjetaDispositivo}
            onPress={() => router.push("/cochera")}
          >
            <View style={estilos.tarjetaHeader}>
              <Text style={estilos.textoDispositivo}>COCHERA</Text>
              <Warehouse color={Colores.textoSecundario} size={28} />
            </View>
            <View style={estilos.tarjetaFooter}>
              <SwitchPersonalizado
                activo={portonAbierto}
                alCambiar={alternarCochera}
              />
            </View>
          </BotonAnimado>

          <BotonAnimado
            estilo={estilos.tarjetaDispositivo}
            onPress={() => router.push("/pared-llorosa")}
          >
            <View style={estilos.tarjetaHeader}>
              <Text style={estilos.textoDispositivo}>PARED</Text>
              <Waves color={Colores.textoSecundario} size={28} />
            </View>
            <View style={estilos.tarjetaFooter}>
              <SwitchPersonalizado
                activo={estadoPared}
                alCambiar={alternarParedLlorosa}
              />
            </View>
          </BotonAnimado>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  contenedorSafe: { flex: 1, backgroundColor: Colores.fondoPrincipal },
  contenedorScroll: {
    padding: Espaciado.grande,
    paddingTop: Espaciado.extragrande,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Espaciado.grande,
  },
  textoBienvenido: {
    color: Colores.textoPrincipal,
    fontSize: Tipografia.tamanos.titulo,
    fontWeight: Tipografia.pesos.medio,
  },
  textoNombre: {
    color: Colores.textoPrincipal,
    fontSize: Tipografia.tamanos.titulo + 4,
    fontWeight: Tipografia.pesos.negrita,
  },

  // NUEVOS ESTILOS PARA EL INDICADOR DE RED
  contenedorIndicador: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  puntoIndicador: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  indicadorRed: {
    fontSize: Tipografia.tamanos.etiqueta,
    fontWeight: Tipografia.pesos.negrita,
  },

  botonConectar: {
    backgroundColor: Colores.fondoTarjetasClaras,
    padding: Espaciado.pequeno,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    width: 80,
  },
  textoBotonConectar: {
    color: Colores.textoSecundario,
    fontSize: 10,
    fontWeight: Tipografia.pesos.negrita,
    marginTop: 4,
  },
  tarjetaProgramado: {
    backgroundColor: Colores.fondoTarjetasClaras,
    padding: Espaciado.mediano,
    borderRadius: 16,
    marginBottom: Espaciado.grande,
  },
  textoProgramadoTitulo: {
    color: Colores.textoSecundario,
    fontSize: Tipografia.tamanos.cuerpo,
    fontWeight: Tipografia.pesos.medio,
  },
  textoProgramadoSubtitulo: {
    color: Colores.textoSecundario,
    fontSize: Tipografia.tamanos.subtitulo,
    fontWeight: Tipografia.pesos.negrita,
  },
  carrusel: { marginBottom: Espaciado.extragrande },
  tarjetaZona: {
    width: 140,
    height: 140,
    borderRadius: 16,
    marginRight: Espaciado.mediano,
    justifyContent: "flex-end",
    padding: Espaciado.mediano,
  },
  textoZona: {
    color: Colores.textoPrincipal,
    fontSize: Tipografia.tamanos.subtitulo,
    fontWeight: Tipografia.pesos.negrita,
  },
  tituloSeccion: {
    color: Colores.textoPrincipal,
    fontSize: Tipografia.tamanos.subtitulo,
    fontWeight: Tipografia.pesos.negrita,
    marginBottom: Espaciado.mediano,
  },
  gridDispositivos: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: Espaciado.mediano,
  },
  tarjetaDispositivo: {
    backgroundColor: Colores.fondoTarjetasOscuras,
    width: "47%",
    height: 110,
    borderRadius: 16,
    padding: Espaciado.mediano,
    justifyContent: "space-between",
  },
  tarjetaHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  tarjetaFooter: { alignItems: "flex-end" },
  textoDispositivo: {
    color: Colores.textoSecundario,
    fontSize: Tipografia.tamanos.cuerpo,
    fontWeight: Tipografia.pesos.negrita,
    marginTop: 4,
  },
});
