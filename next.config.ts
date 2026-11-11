import type { NextConfig } from "next";

const config: NextConfig = {
    output: "standalone",
    poweredByHeader: false,
    reactStrictMode: true,
    outputFileTracingExcludes: {
        "*": ["./src/**"],
    },
};

export default config;
