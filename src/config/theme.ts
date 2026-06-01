// Ant Design 与 Tailwind CSS 颜色映射配置
export const colorTokens = {
  // Ant Design 主题色
  primary: {
    50: '#e6f4ff',
    100: '#bae0ff',
    200: '#87c6ff',
    300: '#50a8ff',
    400: '#248bff',
    500: '#1677ff', // Ant Design 默认主色
    600: '#0958d9',
    700: '#003eb3',
    800: '#002c8c',
    900: '#001d66',
  },
  // 中性色
  gray: {
    50: '#fafafa',
    100: '#f5f5f5',
    200: '#eeeeee',
    300: '#d9d9d9',
    400: '#bfbfbf',
    500: '#8c8c8c',
    600: '#595959',
    700: '#434343',
    800: '#262626',
    900: '#141414',
  },
};

// 响应式断点配置
export const breakpoints = {
  sm: '576px',
  md: '768px',
  lg: '992px',
  xl: '1200px',
  xxl: '1600px',
};

// 间距配置 (与 Ant Design 保持一致)
export const spacing = {
  xs: '8px',
  sm: '12px',
  md: '16px',
  lg: '24px',
  xl: '32px',
  xxl: '48px',
};
