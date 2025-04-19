import theme1 from './theme1';
import theme2 from './theme2';
import theme3 from './theme3';
import theme4 from './theme4';

// Theme colors
export const getThemeColor = (themeId: string): string => {
  switch (themeId) {
    case 'theme1':
      return 'rgb(70,140,212)'; // Default theme color
    case 'theme2':
      return 'rgb(70,140,212)';
    case 'theme3':
      return 'rgb(70,140,212)';
    case 'theme4':
      return 'rgb(70,140,212)';
    default:
      return 'rgb(70,140,212)';
  }
};

// Theme layouts
export const getThemeLayout = (themeId: string): any => {
  switch (themeId) {
    case 'theme1':
      return theme1;
    case 'theme2':
      return theme2;
    case 'theme3':
      return theme3;
    case 'theme4':
      return theme4;
    default:
      return theme1; // Default to theme1
  }
};

// Theme descriptions
export const getThemeInfo = () => {
  return [
    {
      id: "theme1",
      name: "简洁布局",
      description: "简洁明了的基础简历模板，适合各类求职者使用",
      thumbnail: "/templates/theme1.png",
    },
    {
      id: "theme2",
      name: "专业分栏",
      description: "左右分栏设计，适合技术人员展示专业技能和项目经历",
      thumbnail: "/templates/theme2.png",
    },
    {
      id: "theme3",
      name: "创意设计",
      description: "现代风格布局，适合设计师和创意工作者展示个人特色",
      thumbnail: "/templates/theme3.png",
    },
    {
      id: "theme4",
      name: "时间线",
      description: "以时间线为主的设计，突出工作和项目经历",
      thumbnail: "/templates/theme4.png",
    }
  ];
};

// Get theme name
export const getThemeName = (themeId: string): string => {
  const themes = {
    theme1: "简洁布局",
    theme2: "专业分栏",
    theme3: "创意设计",
    theme4: "时间线",
  };
  return themes[themeId as keyof typeof themes] || "未知模板";
}; 