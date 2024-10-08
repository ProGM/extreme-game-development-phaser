import esbuildServe from "esbuild-serve";
import inlineImage from "esbuild-plugin-inline-image";

esbuildServe(
    {
        logLevel: "info",
        entryPoints: ["src/main.ts"],
        bundle: true,
        define: { "process.env.NODE_ENV": "\"development\"" },
        outfile: "public/bundle.min.js",
        plugins: [ inlineImage() ]
    },
    { root: "public", port: 8080 },
);
