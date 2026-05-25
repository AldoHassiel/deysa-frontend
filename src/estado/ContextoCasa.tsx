// src/estado/ContextoCasa.tsx

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { setCallbackMensajeMQTT } from "../servicios/servicio-mqtt";

// ============================================================================
// DEFINICIÓN DE TIPOS
// ============================================================================
export interface EstadoLuz {
  estado: boolean;
  brillo: number;
}
export interface EstadoParedLlorosa {
  estado: boolean;
  horaEncendido: string;
  horaApagado: string;
}
export interface LucesCasa {
  [key: string]: EstadoLuz;
}

interface AlmacenCasa {
  dispositivoConectado: boolean;
  portonAbierto: boolean;
  paredLlorosa: EstadoParedLlorosa;
  luces: LucesCasa;
  actualizarLuz: (habitacion: string, estado: boolean, brillo?: number) => void;
  actualizarPorton: (abierto: boolean) => void;
  actualizarParedLlorosa: (
    estado: boolean,
    horaEncendido?: string,
    horaApagado?: string,
  ) => void;
}

const estadoInicialLuces: LucesCasa = {
  entrada: { estado: false, brillo: 0 },
  calle: { estado: false, brillo: 0 },
  porton: { estado: false, brillo: 0 },
  cocina: { estado: false, brillo: 0 },
  sala: { estado: false, brillo: 0 },
  jardin: { estado: false, brillo: 0 },
  pasillo: { estado: false, brillo: 0 },
  cuarto: { estado: false, brillo: 0 },
  bano: { estado: false, brillo: 0 },
};

// ============================================================================
// CREACIÓN DEL CONTEXTO
// ============================================================================
const Contexto = createContext<AlmacenCasa | undefined>(undefined);

export const ProveedorCasa = ({ children }: { children: ReactNode }) => {
  const [dispositivoConectado, setDispositivoConectado] = useState(false);
  const [portonAbierto, setPortonAbierto] = useState(false);
  const [paredLlorosa, setParedLlorosa] = useState<EstadoParedLlorosa>({
    estado: false,
    horaEncendido: "00:00",
    horaApagado: "00:00",
  });
  const [luces, setLuces] = useState<LucesCasa>(estadoInicialLuces);

  // Escuchamos los mensajes que llegan de HiveMQ para actualizar el estado
  useEffect(() => {
    setCallbackMensajeMQTT((topico, datos) => {
      console.log("MQTT Debug -> Tópico:", topico, "| Datos recibidos:", datos);

      if (topico === "casa/estado") {
        if (datos.luces) setLuces((prev) => ({ ...prev, ...datos.luces }));
        if (datos.portonAbierto !== undefined)
          setPortonAbierto(datos.portonAbierto);
        if (datos.paredLlorosa)
          setParedLlorosa((prev) => ({ ...prev, ...datos.paredLlorosa }));
      } else if (topico === "casa/dispositivo") {
        // Aseguramos que sea booleano, a veces los ESP mandan 1/0
        const esOnline = !!datos.online;
        setDispositivoConectado(esOnline);
      }
    });
  }, []);

  const actualizarLuz = (
    habitacion: string,
    estado: boolean,
    brillo?: number,
  ) => {
    setLuces((prev) => ({
      ...prev,
      [habitacion]: {
        estado,
        brillo: brillo !== undefined ? brillo : prev[habitacion].brillo,
      },
    }));
  };

  const actualizarPorton = (abierto: boolean) => setPortonAbierto(abierto);

  const actualizarParedLlorosa = (
    estado: boolean,
    horaEncendido?: string,
    horaApagado?: string,
  ) => {
    setParedLlorosa((prev) => ({
      estado,
      horaEncendido: horaEncendido || prev.horaEncendido,
      horaApagado: horaApagado || prev.horaApagado,
    }));
  };

  return (
    <Contexto.Provider
      value={{
        dispositivoConectado,
        portonAbierto,
        paredLlorosa,
        luces,
        actualizarLuz,
        actualizarPorton,
        actualizarParedLlorosa,
      }}
    >
      {children}
    </Contexto.Provider>
  );
};

// Hook personalizado para usar el contexto fácilmente
export const useEstadoCasa = () => {
  const contexto = useContext(Contexto);
  if (!contexto)
    throw new Error("usarEstadoCasa debe usarse dentro de un ProveedorCasa");
  return contexto;
};
