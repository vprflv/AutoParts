
export function toPlain<T>(obj: T): any {
    if (obj === null || obj === undefined) {
        return obj;
    }

    // Prisma Decimal
    if (
        typeof obj === "object" &&
        obj !== null &&
        "toNumber" in obj &&
        typeof (obj as any).toNumber === "function"
    ) {
        return (obj as any).toNumber();
    }

    // Date → ISO string
    if (obj instanceof Date) {
        return obj.toISOString();
    }

    // Массив
    if (Array.isArray(obj)) {
        return obj.map((item) => toPlain(item));
    }

    // Объект
    if (typeof obj === "object") {
        const plain: Record<string, any> = {};
        for (const key in obj) {
            plain[key] = toPlain((obj as any)[key]);
        }
        return plain;
    }

    // Примитивы
    return obj;
}