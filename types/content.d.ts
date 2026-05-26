import React from 'react';

declare module '@/content/*' {
  const component: React.ComponentType<any>;
  export default component;
}
