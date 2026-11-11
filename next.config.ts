import type { NextConfig } from "next";

const config: NextConfig = {
    output: "standalone",
    poweredByHeader: false,
    reactStrictMode: true,
    agentRules: false,
    outputFileTracingExcludes: {
        "*": ["./src/**"],
    },
};

export default config;
