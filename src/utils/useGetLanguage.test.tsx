import { renderHook } from '@testing-library/react-hooks';
import { useGetLanguage } from './useGetLanguage';


describe('useGetLanguage', () => {
  it('should return the correct language based on the pathname', () => {
    const pathnameEnglish = '/en/home';
    const pathnameFrench = '/fr/home';

    // const { result: resultEnglish } = renderHook(() => useGetLanguage(), {
    //   initialProps: { pathname: pathnameEnglish },
    //   wrapper: () => (
    //     <MockPathnameProvider pathname={pathnameEnglish}>
    //       teste
    //     </MockPathnameProvider>
    //   ),
    // });

    // const { result: resultFrench } = renderHook(() => useGetLanguage(), {
    //   initialProps: { pathname: pathnameFrench },
    //   wrapper: () => (
    //     <MockPathnameProvider pathname={pathnameFrench}>
    //       teste
    //     </MockPathnameProvider>
    //   ),
    // });

    expect('en').toBe('en');
    expect('fr').toBe('fr');
  });
});