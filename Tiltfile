# -*- mode: Python -*-

docker_compose('./docker-compose.yml')

docker_build(
    'restaurant-app-backend:dev',
    context='./backend',
    dockerfile='./backend/Dockerfile',
    target='dev',
    only=[
        'cmd/',
        'internal/',
        'pkg/',
        'go.mod',
        'go.sum',
        '.air.toml',
    ],
    live_update=[
        sync('./backend/cmd', '/app/cmd'),
        sync('./backend/internal', '/app/internal'),
        sync('./backend/pkg', '/app/pkg'),
        sync('./backend/.air.toml', '/app/.air.toml'),
    ],
)

docker_build(
    'restaurant-app-frontend:dev',
    context='./frontend',
    dockerfile='./frontend/Dockerfile',
    target='dev',
    only=[
        'src/',
        'index.html',
        'package.json',
        'bun.lock',
        'tsconfig.json',
        'vite.config.ts',
    ],
    ignore=[
        'node_modules/',
        'dist/',
        'coverage/',
        '.storybook/cache/',
    ],
    live_update=[
        sync('./frontend/src', '/app/src'),
        sync('./frontend/index.html', '/app/index.html'),
        sync('./frontend/vite.config.ts', '/app/vite.config.ts'),
        sync('./frontend/tsconfig.json', '/app/tsconfig.json'),
    ],
)

dc_resource('postgres',         labels=['infra'])
dc_resource('redis',            labels=['infra'])
dc_resource('redis-commander',  labels=['infra'], links=[link('http://localhost:8081', 'Redis Commander')])
dc_resource('backend',          labels=['app'],   links=[link('http://localhost:8080', 'API')])
dc_resource('frontend',         labels=['app'],   links=[link('http://localhost:3000', 'GUI')])
