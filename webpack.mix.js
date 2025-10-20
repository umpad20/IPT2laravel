const mix = require('laravel-mix');

mix.js('resources/js/index.js', 'public/js').react()
   .sass('resources/sass/app.scss', 'public/css', { implementation: require('sass') })
   .sass('resources/sass/dashboard.scss', 'public/css', { implementation: require('sass') })
   .sourceMaps()
   .version();
