## Description

Nest.js + GraphQL + Prisma ORM　の ボイラープレートです。  

暗黙的なエラーハンドリングを避けるため、neverthrow ライブラリを利用して、Result型を導入しています。

Clean Architecture の原則を意識して、不適切な依存関係を排除することを意識しています。  

## Installation

```bash
$ pnpm install
```

## Running the app

```bash
# development
$ pnpm run start

# watch mode
$ pnpm run start:dev

# production mode
$ pnpm run start:prod
```

## Test

```bash
# unit tests
$ pnpm run test

# e2e tests
$ pnpm run test:e2e

# test coverage
$ pnpm run test:cov
```

## License

Nest.js自体が MIT license のため、それに準拠いたします。

[MIT licensed](LICENSE).
