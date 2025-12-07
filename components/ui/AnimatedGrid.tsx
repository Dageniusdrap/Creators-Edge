import React from 'react';

export const AnimatedGrid = () => (
    <div className="absolute inset-0 overflow-hidden opacity-10 pointer-events-none"> {/* Reduced opacity from 0.2 to 0.1 */}
        <div className="absolute inset-0" style={{
            backgroundImage: `
        linear-gradient(to right, rgba(0, 255, 255, 0.05) 1px, transparent 1px), /* More subtle lines */
        linear-gradient(to bottom, rgba(0, 255, 255, 0.05) 1px, transparent 1px)
      `,
            backgroundSize: '80px 80px', /* Larger grid for less noise */
            animation: 'gridPulse 8s ease-in-out infinite' /* Slower pulse */
        }} />
    </div>
);

export default AnimatedGrid;
