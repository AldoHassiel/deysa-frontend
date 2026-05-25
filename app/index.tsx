import React from "react";
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from "react-native";
import { useRouter } from "expo-router";
import { Lightbulb, Warehouse, Waves, Settings } from "lucide-react-native";
import { Colores, Tipografia, Espaciado } from "../src/constantes/tema";
import BotonAnimado from "../src/componentes/ui/BotonAnimado";
import SwitchPersonalizado from "../src/componentes/ui/SwitchPersonalizado";

import { useEstadoCasa } from "../src/estado/ContextoCasa";
import {
  publicarComandoLuz,
  publicarComandoPorton,
  publicarComandoParedLlorosa,
} from "../src/servicios/servicio-mqtt";

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

  const estaProgramada =
    paredLlorosa.horaEncendido &&
    paredLlorosa.horaApagado &&
    paredLlorosa.horaEncendido !== "00:00" &&
    paredLlorosa.horaApagado !== "00:00";

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
            <Text style={estilos.textoBienvenido}>Bienvenido a</Text>
            <Text style={estilos.textoNombre}>Deysa's House</Text>

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
                    color: dispositivoConectado ? "#4CAF50" : "#E53935",
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
            <Settings color={Colores.textoSecundario} size={24} />
            <Text style={estilos.textoBotonConectar}>CONFIGURAR</Text>
          </BotonAnimado>
        </View>

        <View style={estilos.contenedorCentrado}>
          {estaProgramada && (
            <BotonAnimado estilo={estilos.tarjetaProgramado}>
              <Text style={estilos.textoProgramadoTitulo}>
                Programado: Pared Llorosa
              </Text>
              <Text style={estilos.textoProgramadoSubtitulo}>
                {formatearHoraVisible(paredLlorosa.horaEncendido)} -{" "}
                {formatearHoraVisible(paredLlorosa.horaApagado)}
              </Text>
            </BotonAnimado>
          )}

          <Text style={estilos.tituloSeccion}>DISPOSITIVOS</Text>

          <View style={estilos.gridDispositivos}>
            {/* TARJETA LUCES */}
            <BotonAnimado
              estilo={estilos.tarjetaAnchoCompleto}
              onPress={() => router.push("/luces")}
            >
              <Lightbulb color={Colores.textoSecundario} size={32} />
              <Text style={estilos.textoDispositivoFila}>LUCES</Text>
              <SwitchPersonalizado
                activo={algunaLuzEncendida}
                alCambiar={alternarLucesMaestro}
              />
            </BotonAnimado>

            {/* TARJETA COCHERA */}
            <BotonAnimado
              estilo={estilos.tarjetaAnchoCompleto}
              onPress={() => router.push("/cochera")}
            >
              <Warehouse color={Colores.textoSecundario} size={32} />
              <Text style={estilos.textoDispositivoFila}>COCHERA</Text>
              <SwitchPersonalizado
                activo={portonAbierto}
                alCambiar={alternarCochera}
              />
            </BotonAnimado>

            {/* TARJETA PARED LLOROSA */}
            <BotonAnimado
              estilo={estilos.tarjetaAnchoCompleto}
              onPress={() => router.push("/pared-llorosa")}
            >
              <Waves color={Colores.textoSecundario} size={32} />
              <Text style={estilos.textoDispositivoFila}>PARED LLOROSA</Text>
              <SwitchPersonalizado
                activo={estadoPared}
                alCambiar={alternarParedLlorosa}
              />
            </BotonAnimado>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  contenedorSafe: {
    flex: 1,
    backgroundColor: Colores.fondoPrincipal,
    paddingVertical: 50,
  },
  contenedorScroll: {
    flexGrow: 1,
    padding: Espaciado.grande,
    paddingTop: Espaciado.extragrande,
  },
  contenedorCentrado: {
    flex: 1,
    justifyContent: "center",
    paddingBottom: 40,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Espaciado.mediano,
  },
  textoBienvenido: {
    color: Colores.textoPrincipal,
    fontSize: Tipografia.tamanos.titulo + 10,
    fontWeight: Tipografia.pesos.medio,
  },
  textoNombre: {
    color: Colores.textoPrincipal,
    fontSize: Tipografia.tamanos.titulo + 4,
    fontWeight: Tipografia.pesos.negrita,
  },
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
    fontSize: Tipografia.tamanos.etiqueta + 2,
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
    fontSize: Tipografia.tamanos.cuerpo + 3,
    fontWeight: Tipografia.pesos.medio,
  },
  textoProgramadoSubtitulo: {
    color: Colores.textoSecundario,
    fontSize: Tipografia.tamanos.subtitulo + 2,
    fontWeight: Tipografia.pesos.negrita,
  },
  tituloSeccion: {
    color: Colores.textoPrincipal,
    fontSize: Tipografia.tamanos.subtitulo + 4,
    fontWeight: Tipografia.pesos.negrita,
    marginBottom: Espaciado.mediano,
  },
  gridDispositivos: {
    gap: Espaciado.mediano + 8,
  },
  tarjetaAnchoCompleto: {
    backgroundColor: Colores.fondoTarjetasOscuras,
    width: "100%",
    height: 90,
    borderRadius: 16,
    paddingHorizontal: Espaciado.grande,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  textoDispositivoFila: {
    color: Colores.textoSecundario,
    fontSize: Tipografia.tamanos.cuerpo + 4,
    fontWeight: Tipografia.pesos.negrita,
    flex: 1,
    textAlign: "left",
    marginLeft: Espaciado.grande,
  },
});
