import Lenis from 'lenis';

class SmoothScrollService {
  private lenis: Lenis | null = null;
  private rafId: number | null = null;

  public init(): Lenis {
    if (this.lenis) return this.lenis;

    this.lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Exponential ease-out like Ryze / luxury modern sites
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.8,
      infinite: false,
    });

    const raf = (time: number) => {
      if (this.lenis) {
        this.lenis.raf(time);
        this.rafId = requestAnimationFrame(raf);
      }
    };

    this.rafId = requestAnimationFrame(raf);
    return this.lenis;
  }

  public scrollTo(target: string | HTMLElement | number, options?: { offset?: number; duration?: number; immediate?: boolean }): void {
    if (!this.lenis) {
      this.init();
    }
    if (this.lenis) {
      this.lenis.scrollTo(target, {
        offset: options?.offset ?? -70,
        duration: options?.duration ?? 1.3,
        immediate: options?.immediate ?? false,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      });
    }
  }

  public destroy(): void {
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    if (this.lenis) {
      this.lenis.destroy();
      this.lenis = null;
    }
  }
}

export const smoothScroll = new SmoothScrollService();
