
export interface Point {
    x: number;
    y: number;
  }
  
  // Método de Euler
  export function eulerMethod(
    f: (x: number, y: number) => number,
    x0: number,
    y0: number,
    xEnd: number,
    h: number
  ): Point[] {
    const points: Point[] = [];
    let x = x0;
    let y = y0;
    points.push({ x, y });
  
    while (x < xEnd) {
      y = y + h * f(x, y);
      x = x + h;
      points.push({ x, y });
    }
  
    return points;
  }
  
  // Método de Euler Mejorado (Heun)
  export function improvedEulerMethod(
    f: (x: number, y: number) => number,
    x0: number,
    y0: number,
    xEnd: number,
    h: number
  ): Point[] {
    const points: Point[] = [];
    let x = x0;
    let y = y0;
    points.push({ x, y });
  
    while (x < xEnd) {
      const k1 = f(x, y);
      const k2 = f(x + h, y + h * k1);
      y = y + (h / 2) * (k1 + k2);
      x = x + h;
      points.push({ x, y });
    }
  
    return points;
  }
  
  // Método de Runge-Kutta de 4º orden
  export function rungeKuttaMethod(
    f: (x: number, y: number) => number,
    x0: number,
    y0: number,
    xEnd: number,
    h: number
  ): Point[] {
    const points: Point[] = [];
    let x = x0;
    let y = y0;
    points.push({ x, y });
  
    while (x < xEnd) {
      const k1 = f(x, y);
      const k2 = f(x + h / 2, y + (h / 2) * k1);
      const k3 = f(x + h / 2, y + (h / 2) * k2);
      const k4 = f(x + h, y + h * k3);
  
      y = y + (h / 6) * (k1 + 2 * k2 + 2 * k3 + k4);
      x = x + h;
      points.push({ x, y });
    }
  
    return points;
  }
  