# Changelog

## [6.3.1](https://github.com/doper1/POK/compare/v6.3.0...v6.3.1) (2024-11-04)

### Bug Fixes

- **cd:** docker host variable ([6899426](https://github.com/doper1/POK/commit/68994266ce1d3c2e4c7c0571191fb3e5a47d2b75))

## [6.3.0](https://github.com/doper1/POK/compare/v6.2.0...v6.3.0) (2024-11-04)

### Features

- **test:** global after test configuration ([8b0901e](https://github.com/doper1/POK/commit/8b0901e9472dce228fc56b84f78f9d343c2eeb0c))

### Bug Fixes

- **ci:** add env variables to test stage ([9a8ef25](https://github.com/doper1/POK/commit/9a8ef2595de06eb8c4f485a705077c1e8d50e158))
- **cicd:** postgres hostname ([4593f1a](https://github.com/doper1/POK/commit/4593f1ad7caaea55ceec8783c859760e95521806))
- **ci:** remove visualization from dev ([5cc6607](https://github.com/doper1/POK/commit/5cc6607f825217f47abcc8d95776ea6d851fadcc))
- **ci:** run test db in test stage ([fcfca74](https://github.com/doper1/POK/commit/fcfca74f10c2aaa99575f16d50e02f5269be420f))
- **configuration:** env variables + docker env variables ([14bc2dc](https://github.com/doper1/POK/commit/14bc2dc740d712c5c2cf361cab710e3ab8c60898))
- **middleware:** reorder to prevent false message parsing ([e2c4297](https://github.com/doper1/POK/commit/e2c429763b76dbd5fb9e85bd7870d58b599875f6))
- **route:** missing variable ([a0b27cd](https://github.com/doper1/POK/commit/a0b27cded0e01b345cb4cd241b88c09bdc7d4ce4))

## [6.2.0](https://github.com/doper1/POK/compare/v6.1.0...v6.2.0) (2024-11-03)

### Features

- **db:** seeding and test data declassification ([b152ab5](https://github.com/doper1/POK/commit/b152ab5dd5574d7fc841382c01e90211a741f0b3))
- **middleware:** improved model and prompt ([6c6d718](https://github.com/doper1/POK/commit/6c6d71835261196fda62226b8b64fac23e6c391b))
- **middleware:** multiple API keys to increase limits ([46fa3e1](https://github.com/doper1/POK/commit/46fa3e18e5bcc2bcd6ca80e757cff19c6cbf84d0))
- **test:** renew tests with mock data ([81f63b1](https://github.com/doper1/POK/commit/81f63b16f76efa25f943d3c2baf918f2a1bff021))

### Bug Fixes

- **cd:** env variable name ([b1db6e2](https://github.com/doper1/POK/commit/b1db6e2e94fd4a37a225f3e9c09d44a869e43e75))
- **cd:** grok API key env variable name ([d67940f](https://github.com/doper1/POK/commit/d67940f52284a92432a8c4e2bceaaea4e34c025c))
- **cicd:** env variable name ([f12957b](https://github.com/doper1/POK/commit/f12957bf3d082d1cb489d395cd8bbdb473029985))
- **configuration:** .env varaible name ([619a09c](https://github.com/doper1/POK/commit/619a09c97481af6c834a708a951718ee1e1d045a))
- **configuration:** eslint ([5e27c5a](https://github.com/doper1/POK/commit/5e27c5ac711249aa25f05d46611695554a5e2dc8))
- **middleware:** swap groq with glhf ([b5e32dc](https://github.com/doper1/POK/commit/b5e32dcbd607c0b75fe31dff5b535e8ec7dff592))

## [6.1.0](https://github.com/doper1/POK/compare/v6.0.1...v6.1.0) (2024-10-30)

### Features

- **middleware:** LLM transaltion POC ([c0e36c3](https://github.com/doper1/POK/commit/c0e36c35ad853949fe33d30a0185adb3f64bf370))
- **route:** buy immediatly in game before first bet ([66ceb3e](https://github.com/doper1/POK/commit/66ceb3e5347dc0a36c6718f00873358930f9d688))
- **routes:** buy before first bet of the hand ([f9b5016](https://github.com/doper1/POK/commit/f9b501674f2d58643293d9f885f2d55af72e53a8))

### Bug Fixes

- **ci:** add GROQ_KEY to deployment ([7e08aa7](https://github.com/doper1/POK/commit/7e08aa7a2b85ed77579cf86dd8290388c530e1dd))
- **ci:** add GROQ_KEY to docker compose ([234c5e9](https://github.com/doper1/POK/commit/234c5e95e148ea5a3e516b839c7eda0585c6c9f9))
- **models:** handling players without money ([4bb33ef](https://github.com/doper1/POK/commit/4bb33ef7a122ea35219fa88f6d2e8e3a426f8047))
- **routes:** remove double line ([99337c8](https://github.com/doper1/POK/commit/99337c8bf71a4c774128b491cc6a6e4a0cf7c441))

## [6.0.1](https://github.com/doper1/POK/compare/v6.0.0...v6.0.1) (2024-10-25)

### Bug Fixes

- **src:** exit output mistake ([a2af129](https://github.com/doper1/POK/commit/a2af1293f5de0c9309232607155de9b56dfa1bf3))
- **src:** getFirstPlayer sytnax error ([9a86063](https://github.com/doper1/POK/commit/9a860630cba930bb97b99a84850f0181898c546a))
- **src:** revert getFirstPlayer and fix removePlayer ([80772aa](https://github.com/doper1/POK/commit/80772aac3faff5191e5fb0667784033cd67db7f3))

## [6.0.0](https://github.com/doper1/POK/compare/v5.2.1...v6.0.0) (2024-10-24)

### ⚠ BREAKING CHANGES

- **src:** images for displaying cards

### Features

- playing card images ([277ea52](https://github.com/doper1/POK/commit/277ea525111c59cb6a29fa289495f8d730f90b16))
- **src:** images for displaying cards ([34e88f8](https://github.com/doper1/POK/commit/34e88f8155d5b6c0afaa847c22d7332011c85e5b))

### Bug Fixes

- **cicd:** crontab fix ([d2bb2a7](https://github.com/doper1/POK/commit/d2bb2a7095affd41aafe6c56b2a3c38ea5089492))
- **src:** clean extra whitespaces in messages ([c531d58](https://github.com/doper1/POK/commit/c531d58c8a97bc832814ef5146ef6a28def37ca0))

## [5.2.1](https://github.com/doper1/POK/compare/v5.2.0...v5.2.1) (2024-10-19)

### Bug Fixes

- **cicd:** syntax error ([f817f31](https://github.com/doper1/POK/commit/f817f3172f0f7d29c359d5283999c9b3f7cb5f3f))

## [5.2.0](https://github.com/doper1/POK/compare/v5.1.2...v5.2.0) (2024-10-19)

### Features

- **cicd:** take backups before uploading new version ([99639c0](https://github.com/doper1/POK/commit/99639c0aea7d7e5ecdc3bb1b1096ec4e737215b7))

## [5.1.2](https://github.com/doper1/POK/compare/v5.1.1...v5.1.2) (2024-10-19)

### Bug Fixes

- **cicd:** switch from weekly to daily backups ([01cac16](https://github.com/doper1/POK/commit/01cac16f6717f8a7079f87d7ddef4ce699c38e6e))
- **config:** main script in package.json ([b2cf77d](https://github.com/doper1/POK/commit/b2cf77d2d04d77a54e885b75b15af98475f86540))

## [5.1.1](https://github.com/doper1/POK/compare/v5.1.0...v5.1.1) (2024-10-18)

### Bug Fixes

- **cicd:** syntax fix ([2b61dcd](https://github.com/doper1/POK/commit/2b61dcd6b8d7c8d4839e23933cce20469fd1f30b))

## [5.1.0](https://github.com/doper1/POK/compare/v5.0.0...v5.1.0) (2024-10-18)

### Features

- **cicd:** db backups using pg_dump ([01b18fc](https://github.com/doper1/POK/commit/01b18fcee932160457276b11446415d3d80ff813))

## [5.0.0](https://github.com/doper1/POK/compare/v4.5.4...v5.0.0) (2024-10-16)

### ⚠ BREAKING CHANGES

- CICD done!

### Features

- CICD done! ([d14fdfc](https://github.com/doper1/POK/commit/d14fdfc85bcb769e77032392773eda073b1a90be))
- **cicd:** add images for amd and arm ([d88663a](https://github.com/doper1/POK/commit/d88663a2bf0de511e0207e52dff5f7b23739a6b2))

### Bug Fixes

- **cicd:** docker permissions ([626f7a0](https://github.com/doper1/POK/commit/626f7a000b8108abfa8240f80570ca4ff5cdeac1))
- **cicd:** inherit secrets ([600ddbc](https://github.com/doper1/POK/commit/600ddbc9b341654a21826f56f19bf39f603c79cd))
- **cicd:** remove test trigger for push on main ([8e3370a](https://github.com/doper1/POK/commit/8e3370a3e7de621448c60c0641168538463eba38))
- **cicd:** ssh address and port ([cb2028b](https://github.com/doper1/POK/commit/cb2028b1f59d9d9c922044b3ac2f7da7f0e4f728))
- **cicd:** trigger and scp fixes ([b41d6bd](https://github.com/doper1/POK/commit/b41d6bdcc878df76e06beeb2f609641435cc8014))

## [4.6.16](https://github.com/doper1/POK/compare/v4.6.15...v4.6.16) (2024-10-16)

### Bug Fixes

- **cicd:** inherit secrets ([389615d](https://github.com/doper1/POK/commit/389615da05c3c8e01d966928b6bf57000180cfc6))

## [4.6.15](https://github.com/doper1/POK/compare/v4.6.14...v4.6.15) (2024-10-16)

### Bug Fixes

- **cicd:** fix deployment ([2a1e5d2](https://github.com/doper1/POK/commit/2a1e5d2864aff4006da4e13572856ae04549a84a))

## [4.6.14](https://github.com/doper1/POK/compare/v4.6.13...v4.6.14) (2024-10-16)

### Bug Fixes

- **cicd:** fix deployment ([9c8d594](https://github.com/doper1/POK/commit/9c8d594c9074156b757b11969c5e3580c615e9db))

## [4.6.13](https://github.com/doper1/POK/compare/v4.6.12...v4.6.13) (2024-10-16)

### Bug Fixes

- **cicd:** fix deployment ([ef78007](https://github.com/doper1/POK/commit/ef78007804bc13b1a0977494399dcc7bb24304f6))

## [4.6.12](https://github.com/doper1/POK/compare/v4.6.11...v4.6.12) (2024-10-16)

### Bug Fixes

- **cicd:** fix deployment ([af3300e](https://github.com/doper1/POK/commit/af3300e72cf5c432b53d7cbf38d4c3c03ff1aa70))
- **cicd:** fix deployment ([23ea5bd](https://github.com/doper1/POK/commit/23ea5bd69a854037ca393fe6654ff29bc56d28a7))
- **cicd:** fix deployment ([e59ff4e](https://github.com/doper1/POK/commit/e59ff4eb1dd67a2195e822c77b0dca2544e4f9d9))
- **cicd:** fix deployment ([8ed1681](https://github.com/doper1/POK/commit/8ed168109edf59679e3783bba8ca3ea38b574a6d))

## [4.6.11](https://github.com/doper1/POK/compare/v4.6.10...v4.6.11) (2024-10-16)

### Bug Fixes

- **cicd:** fix deployment ([d66fb6c](https://github.com/doper1/POK/commit/d66fb6c8426d38c920d9259de0404de941524c3a))
- **cicd:** fix deployment ([c937e98](https://github.com/doper1/POK/commit/c937e9840c775a8db752d3f56beaa8b95ee66d2c))

## [4.6.10](https://github.com/doper1/POK/compare/v4.6.9...v4.6.10) (2024-10-16)

### Bug Fixes

- **cicd:** fix deployment ([3973ec1](https://github.com/doper1/POK/commit/3973ec1607d30bfd8a9154f05512c29d53a25b9f))
- **cicd:** fix deployment ([f9b2dd6](https://github.com/doper1/POK/commit/f9b2dd649d5221409bad08fe3ef087ebded611fe))

## [4.6.9](https://github.com/doper1/POK/compare/v4.6.8...v4.6.9) (2024-10-16)

### Bug Fixes

- **cicd:** fix deployment ([8cf5e03](https://github.com/doper1/POK/commit/8cf5e038f4d41224a184038ded843c21f028171d))

## [4.6.8](https://github.com/doper1/POK/compare/v4.6.7...v4.6.8) (2024-10-16)

### Bug Fixes

- **cicd:** fix deployment ([45aa5f9](https://github.com/doper1/POK/commit/45aa5f9f34cf1c0c08d63945743aaba31764edfa))
- **cicd:** fix job skip ([7f59d27](https://github.com/doper1/POK/commit/7f59d277eeba4c4d1becd2fb0b06e910dc5a10f6))
- **cicd:** fix job skip ([dab89f9](https://github.com/doper1/POK/commit/dab89f97a9633a1873c2a9833190b29abba2e080))
- **cicd:** pty ([c213baa](https://github.com/doper1/POK/commit/c213baae82339b1be071bef473d1828e15ba86b6))

## [4.6.7](https://github.com/doper1/POK/compare/v4.6.6...v4.6.7) (2024-10-16)

### Bug Fixes

- **cicd:** fix job skip ([f43dc94](https://github.com/doper1/POK/commit/f43dc942585e11147032442c3f62230984603418))
- **cicd:** pty ([16d8067](https://github.com/doper1/POK/commit/16d80677d24697a978e43ea1f347150123d67e77))

## [4.6.6](https://github.com/doper1/POK/compare/v4.6.5...v4.6.6) (2024-10-16)

### Bug Fixes

- **cicd:** one more try ([be30962](https://github.com/doper1/POK/commit/be3096246df339943aa3340a2fb06b1c0976ae14))

## [4.6.5](https://github.com/doper1/POK/compare/v4.6.4...v4.6.5) (2024-10-16)

### Bug Fixes

- **cicd:** one more try ([cfa57a1](https://github.com/doper1/POK/commit/cfa57a1baeeaeda7e5dfc0bf25bb08aa5ca4afa3))
- **cicd:** one more try ([35a0fe9](https://github.com/doper1/POK/commit/35a0fe9807bf36c4a212a6a9b83141d1e4737432))

## [4.6.4](https://github.com/doper1/POK/compare/v4.6.3...v4.6.4) (2024-10-16)

### Bug Fixes

- **cicd:** one more try ([f992e33](https://github.com/doper1/POK/commit/f992e33231dc57f40da7891d295743a0e673710c))

## [4.6.3](https://github.com/doper1/POK/compare/v4.6.2...v4.6.3) (2024-10-16)

### Bug Fixes

- **cicd:** check execution ([2a9b38e](https://github.com/doper1/POK/commit/2a9b38e1120012c132f0abbe2e79acf3133b7a50))
- **cicd:** check execution ([9d52e0b](https://github.com/doper1/POK/commit/9d52e0b8492979bd708fc49323ed8004c8f9d33e))

## [4.6.2](https://github.com/doper1/POK/compare/v4.6.1...v4.6.2) (2024-10-16)

### Bug Fixes

- **cicd:** ignore deploy on release-please PR ([e1f597b](https://github.com/doper1/POK/commit/e1f597b239a5995b30f2ea46d82f5981bdb1f0e0))

## [4.6.1](https://github.com/doper1/POK/compare/v4.6.0...v4.6.1) (2024-10-16)

### Bug Fixes

- **cicd:** deployment triggering ([bb69456](https://github.com/doper1/POK/commit/bb69456285b15f15421ef4ef9cc0f6fbb703bc96))

## [4.6.0](https://github.com/doper1/POK/compare/v4.5.5...v4.6.0) (2024-10-16)

### Features

- **cicd:** add images for amd and arm ([d6ade9f](https://github.com/doper1/POK/commit/d6ade9fc33c7710850833a63612aee6d9ab15510))

### Bug Fixes

- **cicd:** deployment ([ff33653](https://github.com/doper1/POK/commit/ff3365340f826870bbd93991f01ab94e7ed5c134))
- **cicd:** docker permissions ([a0461af](https://github.com/doper1/POK/commit/a0461afe1e9b47f7548da95c6ba9711046275e79))
- **cicd:** increase timeout of SCP ([7bd8a14](https://github.com/doper1/POK/commit/7bd8a1409aebf489adba5c772d8503163277f995))
- **cicd:** remove test trigger for push on main ([0e50e4d](https://github.com/doper1/POK/commit/0e50e4d4ae732042321adecf258e7781684dc523))
- **cicd:** ssh address and port ([d1744d9](https://github.com/doper1/POK/commit/d1744d9253739af7f16cd8e4aaf59aebfc140922))
- **cicd:** trigger of the release workflow ([097fa43](https://github.com/doper1/POK/commit/097fa431af41d83dfe40d7b9eabafe4177be6376))

## [4.5.5](https://github.com/doper1/POK/compare/v4.5.4...v4.5.5) (2024-10-16)

### Bug Fixes

- **cicd:** trigger and scp fixes ([d445772](https://github.com/doper1/POK/commit/d44577255d8e1b6385115fdba7e5ad09a54a1c04))

## [4.5.4](https://github.com/doper1/POK/compare/v4.5.3...v4.5.4) (2024-10-16)

### Bug Fixes

- **cicd:** ssh config pre scp ([0f2ff19](https://github.com/doper1/POK/commit/0f2ff198876b69a9c6aeaa26e8d3a4d79afa26ab))

## [4.5.3](https://github.com/doper1/POK/compare/v4.5.2...v4.5.3) (2024-10-16)

### Bug Fixes

- **cicd:** deployment ([65276fa](https://github.com/doper1/POK/commit/65276fa04383e8330a5d5d824b8576262333aaff))

## [4.5.2](https://github.com/doper1/POK/compare/v4.5.1...v4.5.2) (2024-10-16)

### Bug Fixes

- **cicd:** release and deployment ([a2db865](https://github.com/doper1/POK/commit/a2db865a9b8b8de81a9b32807c6bbd655f08299e))

## [4.5.1](https://github.com/doper1/POK/compare/v4.5.0...v4.5.1) (2024-10-16)

### Bug Fixes

- **cicd:** workflow triggers ([f4b1c70](https://github.com/doper1/POK/commit/f4b1c70f3d03a3e10f3c45e03af21c360b4dc17f))

## [4.5.0](https://github.com/doper1/POK/compare/v4.0.7...v4.5.0) (2024-10-16)

### ⚠ BREAKING CHANGES

- **deployment:** CD from github to the server

### Features

- **deployment:** CD from github to the server ([83f3a38](https://github.com/doper1/POK/commit/83f3a3808c10443ef1711f0f450060f4a750045c))

### Bug Fixes

- **ci:** test workflow trigger missing ([d6ba51a](https://github.com/doper1/POK/commit/d6ba51ab8e894e8983d4b1db5bf853f69be25df7))
- **deps:** drizzle and whatsapp-web.js versions ([3389b43](https://github.com/doper1/POK/commit/3389b4302c19a039e05a2b43b58c7f626fcefb94))

### Miscellaneous Chores

- release 4.5.0 ([8379fed](https://github.com/doper1/POK/commit/8379fedbb5bf988d6177ccd60bf0f1edf22766ea))

## [4.0.7](https://github.com/doper1/POK/compare/v4.0.6...v4.0.7) (2024-10-13)

### Bug Fixes

- **deployment:** remove neon workflow ([2eb16f4](https://github.com/doper1/POK/commit/2eb16f41b0ffcb6838d22637f9d8661e65f90109))

## [4.0.6](https://github.com/doper1/POK/compare/v4.0.5...v4.0.6) (2024-10-12)

### Bug Fixes

- **src:** remove log of unrelated messages ([369c812](https://github.com/doper1/POK/commit/369c8127d402a89448838737ae9a88c6863bcf98))

## [4.0.5](https://github.com/doper1/POK/compare/v4.0.4...v4.0.5) (2024-10-12)

### Bug Fixes

- **src:** pick SB/BB player ([4f931f7](https://github.com/doper1/POK/commit/4f931f74687a8503ba5b6f855e369b5f86956342))

## [4.0.4](https://github.com/doper1/POK/compare/v4.0.3...v4.0.4) (2024-10-10)

### Bug Fixes

- **src:** missing async in pre exit ([fa88e57](https://github.com/doper1/POK/commit/fa88e5754f1605c4c478026bcf82e65c5fda2126))

## [4.0.3](https://github.com/doper1/POK/compare/v4.0.2...v4.0.3) (2024-10-10)

### Bug Fixes

- **src:** message timeout and pre/inGame routing ([d07574a](https://github.com/doper1/POK/commit/d07574a680a2c49488ecb6a2d08e8d4dfd92c431))

## [4.0.2](https://github.com/doper1/POK/compare/v4.0.1...v4.0.2) (2024-10-09)

### Bug Fixes

- groups id length increase ([1018cc8](https://github.com/doper1/POK/commit/1018cc8fd792fc1d1db07c9f3250eb07a0217c4e))
- wrong help message ([675af79](https://github.com/doper1/POK/commit/675af79df5cae1f1db10b1667d908e9f84b375b9))

## [4.0.1](https://github.com/doper1/POK/compare/v4.0.0...v4.0.1) (2024-10-09)

### Bug Fixes

- post merge fixes ([cb7a322](https://github.com/doper1/POK/commit/cb7a3225d2d40be818ddf9aae80a73cd4abeea22))
- **src:** add sandbox to puppeteer client ([36a5322](https://github.com/doper1/POK/commit/36a53223b7fd9c63bcd1edc35b354ae3b8497584))

## [4.0.0](https://github.com/doper1/POK/compare/v3.1.0...v4.0.0) (2024-10-09)

### ⚠ BREAKING CHANGES

- **src:** DB integration in helper scripts
- **src:** refactor classes into models
- **src:** created repos for DB access
- **db:** schema and drizzle configuration
- **db:** full drizzle-orm setup
- **deployment:** full Docker set up

### Features

- **db:** full drizzle-orm setup ([f2ec755](https://github.com/doper1/POK/commit/f2ec755955675e0734180db9b98f58d333481454))
- **db:** schema and drizzle configuration ([9e6080e](https://github.com/doper1/POK/commit/9e6080e1eb8ed6f03c5f169bf6ad33b8dee40125))
- **deployment:** full Docker set up ([d690ee5](https://github.com/doper1/POK/commit/d690ee5ef972b19ee1709bacf887aaf98fdd5bac)), closes [#130](https://github.com/doper1/POK/issues/130)
- **deployment:** initial docker implementation ([b6dc22d](https://github.com/doper1/POK/commit/b6dc22d0b454b0e3a2124fe6a0a1539eba898a21))
- **src:** created repos for DB access ([a5bd80d](https://github.com/doper1/POK/commit/a5bd80db034aea0c76990c483c0192008ea3b662))

### Bug Fixes

- add drizzle-kit to image ([85db269](https://github.com/doper1/POK/commit/85db269f697c7d581b9654be01540ded013a979d))
- **cfg:** moved cross-env to dependencies from dev deps ([1211e50](https://github.com/doper1/POK/commit/1211e503f858ad4f4b63ae90e40c6e04a2c1e1ec))
- **cfg:** remove --watch from 'npm start' ([47badce](https://github.com/doper1/POK/commit/47badce656a3d3dc408a445f59184404e58ab384))
- **ci:** renamed release workflow for clarity ([52968e4](https://github.com/doper1/POK/commit/52968e4d45fe4349231863335dc390953a730678))

### Code Refactoring

- **src:** DB integration in helper scripts ([9629cee](https://github.com/doper1/POK/commit/9629ceeb64ec614b7ce8f069361b82d75d594b65))
- **src:** refactor classes into models ([8fba983](https://github.com/doper1/POK/commit/8fba983a7face9f38bb6837e7aa60053e209fc62))

## [3.1.0](https://github.com/doper1/POK/compare/v3.0.1...v3.1.0) (2024-09-20)

### Features

- **src:** add simple logging of messages to console ([d8103ed](https://github.com/doper1/POK/commit/d8103edd69889ea3ef5cc1ff776fa5c33a2341c9))

## [3.0.1](https://github.com/doper1/POK/compare/v3.0.0...v3.0.1) (2024-09-20)

### Bug Fixes

- **src:** 'pok end' now waits for the hand to end ([81f582b](https://github.com/doper1/POK/commit/81f582b7f38f464c5cae7569e6221322ead12c97))
- **src:** player removal upon exit ([cf247fc](https://github.com/doper1/POK/commit/cf247fcc0d6362baa8cb0e7a23a1eb2214b68f1c))

## [3.0.0](https://github.com/doper1/POK/compare/v2.0.0...v3.0.0) (2024-09-19)

### ⚠ BREAKING CHANGES

- **src:** all in functionality now has no bugs
- **cfg:** new release workflow with release-please

### Features

- **docs:** will release-please work? ([fc506fe](https://github.com/doper1/POK/commit/fc506fe477340bc44d206c91afe7934df72eece6))
- **src:** add option to buy while joining ([ec40ae7](https://github.com/doper1/POK/commit/ec40ae749cbbd97d353a2de180a1647910435ec4))
- **src:** add player limit of 23 players ([1008c96](https://github.com/doper1/POK/commit/1008c96005717ec59c405d430582797692ae9494))

### Bug Fixes

- **cfg:** new release workflow with release-please ([f863dad](https://github.com/doper1/POK/commit/f863dade6cd9b2d1a9f057d4afef2f484c0d9885))
- **cfg:** remove old semantic-release traces ([6acc8a1](https://github.com/doper1/POK/commit/6acc8a173c3d7d97dfb6aea87a55b635c8ec1d6e))
- **cfg:** remove semantic-release from deps and release workflow" ([50b6881](https://github.com/doper1/POK/commit/50b688186656c0decb99c0a9edf6bfc0699a84ec))
- **cfg:** trying to triggering release ([7a740be](https://github.com/doper1/POK/commit/7a740beca2c0c2a4973722add17999869aaa8dfa))
- **src:** all in functionality now has no bugs ([084df8d](https://github.com/doper1/POK/commit/084df8d294a8b2cf47e8a61aebc2fa61f43ec6e2))
