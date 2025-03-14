/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.js");

/** @type {import("next").NextConfig} */
const config = {
  // 设置为静态导出模式
  output: 'export',
  // 禁用图像优化，因为静态导出不支持
  images: {
    unoptimized: true,
  },
  // 禁用严格模式以避免一些开发时的双重渲染问题
  reactStrictMode: false,
};

export default config;
