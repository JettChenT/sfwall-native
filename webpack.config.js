module.exports = {
    module: {
        rules: [
            {
                loader: 'postcss-loader',
                options: {
                  ident: 'postcss',
                  plugins: [require('tailwindcss'), require('autoprefixer')]
                }
              }
        ]
        }
    }