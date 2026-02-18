import nextConfig from "eslint-config-next";
import nextVitals from "eslint-config-next/core-web-vitals.js";

const eslintConfig = [
  {
    ignores: [
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
    ],
  },
  nextConfig,
  nextVitals,
];

export default eslintConfig;
