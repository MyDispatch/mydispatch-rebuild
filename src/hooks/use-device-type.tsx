import { useState, useEffect } from 'react';

export type DeviceType = 'mobile' | 'tablet' | 'desktop';

interface DeviceTypeHook {
  deviceType: DeviceType;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
}

export function useDeviceType(): DeviceTypeHook {
  const [deviceType, setDeviceType] = useState<DeviceType>(() => {
    const width = window.innerWidth;
    if (width < 768) return 'mobile';
    if (width < 1024) return 'tablet';
    return 'desktop';
  });

  useEffect(() => {
    const updateDeviceType = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setDeviceType('mobile');
      } else if (width < 1024) {
        setDeviceType('tablet');
      } else {
        setDeviceType('desktop');
      }
    };

    const mql = window.matchMedia('(max-width: 767px)');
    const mql2 = window.matchMedia('(max-width: 1023px)');
    
    mql.addEventListener('change', updateDeviceType);
    mql2.addEventListener('change', updateDeviceType);
    
    return () => {
      mql.removeEventListener('change', updateDeviceType);
      mql2.removeEventListener('change', updateDeviceType);
    };
  }, []);

  return {
    deviceType,
    isMobile: deviceType === 'mobile',
    isTablet: deviceType === 'tablet',
    isDesktop: deviceType === 'desktop',
  };
}
