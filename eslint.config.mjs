import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
});

export default [
    ...compat.extends("next/core-web-vitals"),
    {
        rules: {
            // твои кастомные правила, если есть
            "@next/next/no-html-link-for-pages": "warn",
        },
    },
    {
        ignores: [".next/**", "node_modules/**", "out/**"],
    },
];