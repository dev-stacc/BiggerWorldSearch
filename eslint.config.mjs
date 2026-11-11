import next from "eslint-config-next";
import coreWebVitals from "eslint-config-next/core-web-vitals";
import typescript from "eslint-config-next/typescript";
import prettier from "eslint-config-prettier";

const config = [
    { ignores: [".next/**", "node_modules/**", "next-env.d.ts"] },
    ...[next, coreWebVitals, typescript].flat(),
    prettier,
];

export default config;
