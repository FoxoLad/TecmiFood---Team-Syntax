/** Paleta de la app. El claro es crema; el oscuro es un negro cálido, no un negro puro. */
export type Palette = {
    background: string;
    surface: string;
    surfaceMuted: string;
    text: string;
    textSecondary: string;
    border: string;
    accent: string;
    accentSoft: string;
    blue: string;
    danger: string;
    success: string;
    statusBar: "light-content" | "dark-content";
};

export const lightColors: Palette = {
    background: "#F7F5F0",
    surface: "#FFFFFF",
    surfaceMuted: "#E5E5EA",
    text: "#1C1C1E",
    textSecondary: "#636366",
    border: "#D1D1D6",
    accent: "#8F651A",
    accentSoft: "#E9DDBD",
    blue: "#007AFF",
    danger: "#FF3B30",
    success: "#34C759",
    statusBar: "dark-content",
};

export const darkColors: Palette = {
    background: "#14110F",
    surface: "#221C18",
    surfaceMuted: "#2C261F",
    text: "#F4EDE4",
    textSecondary: "#C4B5A4",
    border: "#3A322B",
    accent: "#E2B15A",
    accentSoft: "#3A2E22",
    blue: "#79B8FF",
    danger: "#FF7A72",
    success: "#3DDC84",
    statusBar: "light-content",
};

/** El empleado sigue usando la paleta clara. El cliente toma useColors(). */
export const colors = lightColors;

export const radii = {
    small: 10,
    medium: 16,
    large: 22,
    pill: 999,
};

export const spacing = {
    screen: 16,
    section: 20,
};

/** Panel del empleado. El cliente sigue en crema; la cocina usa un durazno claro. */
export const employee = {
    background: "#F6E4CF",
    surface: "#FFF9F3",
    text: "#4A3424",
    muted: "#8A6A50",
    accent: "#9A6230",
    border: "rgba(154, 98, 48, 0.28)",
};

/** Acceso de Modo Cocina en el perfil oscuro: cacao, para no verse como un parche claro sobre el negro. */
export const employeeOnDark = {
    background: "#322820",
    surface: "#45362C",
    text: "#F6EBDF",
    muted: "#D2BBA6",
    accent: "#E2B15A",
    border: "rgba(226, 177, 90, 0.38)",
};

/** Tarjetas de cafetería en inicio. En oscuro el caramelo sube y el amarillo baja para convivir con el negro. */
export const cafeteriaOptionColors = {
    light: {
        bustersHeader: "#8F651A",
        bustersCard: "#8F651A",
        beeSweetHeader: "#d4af37",
        beeSweetCard: "#e2bf43",
    },
    dark: {
        bustersHeader: "#7A4E22",
        bustersCard: "#A86B34",
        beeSweetHeader: "#735C24",
        beeSweetCard: "#8F7330",
    },
} as const;

export const shadows = {
    card: {
        shadowColor: "#302512",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 10,
        elevation: 3,
    },
};
