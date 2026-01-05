import { ImageResponse } from 'next/og';

// Route segment config
export const runtime = 'edge';

// Image metadata
export const size = {
    width: 32,
    height: 32,
};
export const contentType = 'image/png';

// Image generation
export default function Icon() {
    return new ImageResponse(
        (
            // ImageResponse JSX element
            <div
                style={{
                    fontSize: 22, // Increased slighly
                    background: '#17BEBB',
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    borderRadius: '50%',
                    fontWeight: 900, // Maximized weight
                    paddingBottom: '2px', // Optical adjustment for vertical centering if needed
                }}
            >
                M
            </div>
        ),
        // ImageResponse options
        {
            ...size,
        }
    );
}
