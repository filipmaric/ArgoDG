const path = require('path');

module.exports = {
    mode: 'production',
    entry: {
        ComplexGeom: './src/complex_geom.js',
        DG: './src/dg.js',
        RC: {
            import: './src/rc.js',
            dependOn: 'DG',
        },
        RCP: {
            import: './src/rc_poincare.js',
            dependOn: 'DG',
        },
        RCP_HP: {
            import: './src/rc_poincare_half_plane.js',
            dependOn: 'DG',
        },        
        ANP: {
            import: './src/an_poincare.js',
            dependOn: 'DG',
        },
        ANP_HP: {
            import: './src/an_poincare_half_plane.js',
            dependOn: 'DG',
        },
    },
    output: {
        filename: '[name].js',
        library: {
            name: '[name]',
            type: 'umd',
        },
        path: path.resolve(__dirname, 'dist'),
    },
};
