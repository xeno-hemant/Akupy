import { useState } from 'react';

/**
 * useShareProduct — share a product URL using Web Share API (mobile)
 * or clipboard fallback.
 * Returns: { share, copied }
 */
export default function useShareProduct() {
    const [copied, setCopied] = useState(false);

    const share = async ({ productId, productName }) => {
        const url = `https://akupy.in/product/${productId}`;
        const title = productName || 'Check this out on Akupy!';

        // Mobile native share
        if (navigator.share) {
            try {
                await navigator.share({ title, text: `${title}\n${url}`, url });
                return;
            } catch {
                // User cancelled native share — fall through to clipboard
            }
        }

        // Clipboard fallback
        try {
            await navigator.clipboard.writeText(url);
        } catch {
            // Older browser fallback
            const el = document.createElement('textarea');
            el.value = url;
            el.style.cssText = 'position:fixed;opacity:0;top:0;left:0';
            document.body.appendChild(el);
            el.select();
            document.execCommand('copy');
            document.body.removeChild(el);
        }

        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
    };

    return { share, copied };
}
