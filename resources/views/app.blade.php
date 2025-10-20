<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Jaypee University Dashboard</title>

    {{-- Compiled CSS --}}
    <link rel="stylesheet" href="{{ mix('/css/app.css') }}">
    <link rel="stylesheet" href="{{ mix('/css/dashboard.css') }}">
</head>
<body>
    {{-- React mounts here --}}
    <div id="root"></div>

    {{-- Compiled JS --}}
    <script src="{{ mix('/js/index.js') }}"></script>

    {{-- Laravel debug info --}}
    @if(config('app.debug'))
        <script>
            console.log('Debug mode is ON');
        </script>
    @endif
</body>
</html>
