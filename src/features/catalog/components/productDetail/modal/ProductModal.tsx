'use client';

import { useEffect, useState } from 'react';
import { Product } from '@/types';
import ProductModalDesktop from './ProductModalDesktop';
import ProductModalMobile from './ProductModalMobile';

interface ProductModalProps {
    product: Product;
    isOpen: boolean;
    onClose: () => void;
}

export default function ProductModal({ product, isOpen, onClose }: ProductModalProps) {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkScreen = () => {
            setIsMobile(window.innerWidth < 1024); // lg breakpoint
        };

        checkScreen();
        window.addEventListener('resize', checkScreen);

        return () => window.removeEventListener('resize', checkScreen);
    }, []);

    if (!isOpen || !product) return null;

    return isMobile
        ? <ProductModalMobile product={product} onClose={onClose} />
        : <ProductModalDesktop product={product} onClose={onClose} />;
}