/**
 * 与各页面里的 tailwind.config（Play CDN）保持一致：
 *   primary / primary-d / primary-l
 * 扫描范围 = wazhanggui-code 下各端原型目录的 html + js（含 menu-data.js）
 * 逐目录列出，避免把 node_modules 扫进来。
 * 页面里若有"动态拼接"出来的 class，请补到下面的 safelist。
 */
module.exports = {
  content: [
    '../yunying-PC/**/*.{html,js}',
    '../mai-APP/**/*.{html,js}',
    '../shanghu-APP/**/*.{html,js}',
    '../mai-PC/**/*.{html,js}',
    '../daping-PC/**/*.{html,js}',
    '../strategy/**/*.{html,js}',
  ],
  safelist: [],
  theme: {
    extend: {
      colors: {
        primary: '#FF4D2D',
        'primary-d': '#E63E20',
        'primary-l': '#FF7849',
      },
    },
  },
};
