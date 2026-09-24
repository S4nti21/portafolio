/**
 * Todos los datos y textos del portafolio, en un solo lugar.
 * Para cambiar un texto, un link o una habilidad, editá este archivo.
 * (Las misiones están aparte, en src/content/misiones/.)
 */

export type IdSeccion = 'historia' | 'entrenamiento' | 'misiones' | 'contacto';

export interface Seccion {
  /** Numeración romana que aparece en color de energía. */
  numero: string;
  /** Etiqueta chica que acompaña al número. */
  etiqueta: string;
  /** Título grande de la sección. */
  titulo: string;
  /** Texto del link en la barra de navegación. */
  enlace: string;
}

export interface Dato {
  etiqueta: string;
  valor: string;
}

export interface NivelEntrenamiento {
  /** Número de nivel, con cero adelante ('03'). */
  numero: string;
  rango: string;
  descripcion: string;
  /** Largo de la hoja de energía, de 0 a 1: cuanto más larga, más horas de vuelo. */
  largo: number;
  /** Si es true, los chips se muestran punteados (habilidades en entrenamiento). */
  enEntrenamiento?: boolean;
  habilidades: string[];
}

export interface Perfil {
  nombre: string;
  rol: string;
  tecnologias: string[];
  ubicacion: {
    ciudad: string;
    region: string;
    pais: string;
    codigoPais: string;
    coordenadas: string;
  };
  secciones: Record<IdSeccion, Seccion>;
  hero: {
    etiqueta: string;
    bajada: string;
    botonPrincipal: string;
    botonSecundario: string;
    indicacionScroll: string;
  };
  historia: {
    cita: string;
    texto: string;
    datos: Dato[];
    estado: Dato;
    fotoAlt: string;
  };
  entrenamiento: {
    subtitulo: string;
    niveles: NivelEntrenamiento[];
  };
  contacto: {
    bajada: string;
    email: string;
    linkedin: string;
    github: string;
    /** Ruta del CV dentro de public/. */
    cv: string;
    /** Poné true para mostrar el teléfono en la sección de contacto. */
    mostrarTelefono: boolean;
    telefono: {
      /** Como se lee en pantalla. */
      visible: string;
      /** Formato internacional para el link tel: (Argentina, celular: +54 9 …). */
      enlace: string;
    };
  };
  footer: {
    hechoEn: string;
  };
  intro: {
    lineaInicial: string;
    episodio: string;
    tituloEpisodio: string;
    parrafos: string[];
    /** Versión corta para quien prefiere movimiento reducido. */
    resumenEstatico: string;
  };
  seo: {
    titulo: string;
    descripcion: string;
  };
}

export const perfil: Perfil = {
  nombre: 'Santiago Weidmann',
  rol: 'Desarrollador de Software Jr.',
  tecnologias: ['Java', 'React', 'JavaScript'],
  ubicacion: {
    ciudad: 'Santa Fe',
    region: 'Santa Fe',
    pais: 'Argentina',
    codigoPais: 'AR',
    coordenadas: '31°38′ S · 60°42′ O',
  },
  secciones: {
    historia: { numero: 'I', etiqueta: 'Sobre mí', titulo: 'Mi historia', enlace: 'Mi historia' },
    entrenamiento: {
      numero: 'II',
      etiqueta: 'Habilidades',
      titulo: 'Entrenamiento',
      enlace: 'Entrenamiento',
    },
    misiones: {
      numero: 'III',
      etiqueta: 'Proyectos',
      titulo: 'Misiones completadas',
      enlace: 'Misiones',
    },
    contacto: {
      numero: 'IV',
      etiqueta: 'Contacto',
      titulo: 'Unite a la misión',
      enlace: 'Contacto',
    },
  },
  hero: {
    etiqueta: 'Santa Fe · Episodio I de mi carrera',
    bajada:
      'Construyo aplicaciones web de punta a punta: del backend en Java y Spring al frontend en React.',
    botonPrincipal: 'Ver misiones',
    botonSecundario: 'Unite a la misión',
    indicacionScroll: 'Desplazate',
  },
  historia: {
    cita: 'Todo gran desarrollador fue alguna vez un Padawan que no dejó de practicar.',
    texto:
      'Soy estudiante avanzado de la Tecnicatura en Desarrollo de Software en el I.E.S., cursando el último año. Aprendí desarrollo web, programación y bases de datos tanto en la carrera como en proyectos prácticos. Hoy busco mi primera oportunidad full-time o junior para aportar lo que sé, ganar experiencia profesional y seguir creciendo.',
    datos: [
      { etiqueta: 'Base', valor: 'Santa Fe, AR' },
      { etiqueta: 'Formación', valor: 'Téc. en Desarrollo de Software (último año)' },
      { etiqueta: 'Idiomas', valor: 'Español nativo, Inglés técnico' },
    ],
    estado: { etiqueta: 'Estado', valor: 'Buscando mi primera misión' },
    fotoAlt: 'Retrato de Santiago Weidmann',
  },
  entrenamiento: {
    subtitulo:
      'Tres niveles, de lo que uso con confianza a lo que estoy entrenando. Cuanto más larga la hoja, más horas de vuelo.',
    niveles: [
      {
        numero: '03',
        rango: 'Caballero',
        descripcion: 'Lo que uso con confianza',
        largo: 1,
        habilidades: ['Java', 'Spring', 'JavaScript', 'React', 'HTML5', 'CSS3', 'MySQL'],
      },
      {
        numero: '02',
        rango: 'Padawan',
        descripcion: 'Lo que estoy entrenando',
        largo: 0.66,
        enEntrenamiento: true,
        habilidades: ['Angular', 'Node.js', 'TypeScript', 'Astro'],
      },
      {
        numero: '01',
        rango: 'Arsenal',
        descripcion: 'Herramientas del día a día',
        largo: 0.33,
        habilidades: ['Git y GitHub', 'IA aplicada al desarrollo (prompting)'],
      },
    ],
  },
  contacto: {
    bajada: 'Elegí tu lado. Yo pongo el resto.',
    email: 'sweidmann13@gmail.com',
    linkedin: 'https://www.linkedin.com/in/santiagoweidmann',
    github: 'https://github.com/S4nti21',
    cv: '/cv/CV_Santiago_Weidmann_ATS.pdf',
    mostrarTelefono: false,
    telefono: { visible: '3404-529854', enlace: '+5493404529854' },
  },
  footer: {
    hechoEn: 'Hecho en Santa Fe',
  },
  intro: {
    lineaInicial: 'Hace no tanto tiempo, en una ciudad no tan lejana…',
    episodio: 'Episodio I',
    tituloEpisodio: 'La primera misión',
    parrafos: [
      'Es un período de entrenamiento intenso. Desde las aulas del I.E.S. en Santa Fe, un joven desarrollador domina Java, Spring y React, construyendo aplicaciones web proyecto a proyecto.',
      'Con el último año de formación en marcha, Santiago Weidmann busca su primera misión en un equipo real, donde poner en práctica todo lo aprendido y seguir creciendo en la galaxia tecnológica…',
    ],
    resumenEstatico:
      'Desde las aulas del I.E.S. en Santa Fe, un joven desarrollador de Java, Spring y React busca su primera misión en un equipo real.',
  },
  seo: {
    titulo: 'Santiago Weidmann · Desarrollador de Software Jr. (Java · React)',
    descripcion:
      'Portafolio de Santiago Weidmann, desarrollador de software Jr. en Santa Fe, Argentina. Aplicaciones web de punta a punta con Java, Spring, React y JavaScript.',
  },
};
