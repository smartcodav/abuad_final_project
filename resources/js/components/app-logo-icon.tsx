import { SVGAttributes } from 'react';

export default function AppLogoIcon(props: SVGAttributes<SVGElement>) {
    return (
        <svg {...props} viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
            {/* corner scan brackets */}
            <rect x="4" y="4" width="3" height="10" rx="1.5" />
            <rect x="4" y="4" width="10" height="3" rx="1.5" />

            <rect x="33" y="4" width="3" height="10" rx="1.5" />
            <rect x="26" y="4" width="10" height="3" rx="1.5" />

            <rect x="4" y="26" width="3" height="10" rx="1.5" />
            <rect x="4" y="33" width="10" height="3" rx="1.5" />

            <rect x="33" y="26" width="3" height="10" rx="1.5" />
            <rect x="26" y="33" width="10" height="3" rx="1.5" />

            {/* face */}
            <circle cx="14.5" cy="17.5" r="2.25" />
            <circle cx="25.5" cy="17.5" r="2.25" />
            <rect x="14" y="26" width="12" height="2.5" rx="1.25" />
        </svg>
    );
}
