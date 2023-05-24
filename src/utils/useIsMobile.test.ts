import { renderHook } from '@testing-library/react-hooks';
import useIsMobile from './useIsMobile';

describe('useIsMobile', () => {
  it('should return true when screen width is less than or equal to 768px', () => {
    const { result } = renderHook(() => useIsMobile());

    // Define a largura da tela como 500px (menor que 768px)
    window.innerWidth = 500;
    window.dispatchEvent(new Event('resize'));

    expect(result.current).toBe(true);
  });

  it('should return false when screen width is greater than 768px', () => {
    const { result } = renderHook(() => useIsMobile());

    // Define a largura da tela como 1024px (maior que 768px)
    window.innerWidth = 1024;
    window.dispatchEvent(new Event('resize'));

    expect(result.current).toBe(false);
  });

  it('should maintain the correct value on screen resize', () => {
    const { result } = renderHook(() => useIsMobile());

    // Inicialmente, a largura da tela é definida como 500px (menor que 768px)
    window.innerWidth = 500;
    window.dispatchEvent(new Event('resize'));
    expect(result.current).toBe(true);

    // Redimensiona a largura da tela para 800px (maior que 768px)
    window.innerWidth = 800;
    window.dispatchEvent(new Event('resize'));
    expect(result.current).toBe(false);

    // Redimensiona a largura da tela novamente para 600px (menor que 768px)
    window.innerWidth = 600;
    window.dispatchEvent(new Event('resize'));
    expect(result.current).toBe(true);
  });
});
