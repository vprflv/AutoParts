import Image from "next/image";

interface ProductImageProps {
    src?: string | null;
    alt: string;
    size?: number;
    className?: string;
}

export default function ProductImage({
                                         src,
                                         alt,
                                         size = 56,
                                         className = ""
                                     }: ProductImageProps) {

    if (!src) {
        return (
            <div
                className={`bg-zinc-800 rounded-2xl overflow-hidden flex items-center justify-center ${className}`}
                style={{ width: size, height: size }}
            >
                <Image
                    src="/images/placeholder.svg"
                    alt="No image"
                    width={size * 0.6}
                    height={size * 0.6}
                    className="opacity-40"
                />
            </div>
        );
    }

    return (
        <div
            className={`relative bg-zinc-800 rounded-2xl overflow-hidden ${className}`}
            style={{ width: size, height: size }}
        >
            <Image
                src={src}
                alt={alt}
                fill
                className="object-cover"
            />
        </div>
    );
}