export interface NetworkLink {
  id: string;
  label: string;
  href: string;
  x: number;
  y: number;
}

export interface CursorPosition {
  x: number;
  y: number;
}

export interface LogoRotationState {
  current: number;
  target: number;
}
