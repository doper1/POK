# Changelog

## [4.5.0](https://github.com/doper1/POK/compare/v4.0.7...v4.5.0) (2024-10-16)


### ⚠ BREAKING CHANGES

* **deployment:** CD from github to the server

### Features

* **deployment:** CD from github to the server ([83f3a38](https://github.com/doper1/POK/commit/83f3a3808c10443ef1711f0f450060f4a750045c))


### Bug Fixes

* **ci:** test workflow trigger missing ([d6ba51a](https://github.com/doper1/POK/commit/d6ba51ab8e894e8983d4b1db5bf853f69be25df7))
* **deps:** drizzle and whatsapp-web.js versions ([3389b43](https://github.com/doper1/POK/commit/3389b4302c19a039e05a2b43b58c7f626fcefb94))


### Miscellaneous Chores

* release 4.5.0 ([8379fed](https://github.com/doper1/POK/commit/8379fedbb5bf988d6177ccd60bf0f1edf22766ea))

## [4.0.7](https://github.com/doper1/POK/compare/v4.0.6...v4.0.7) (2024-10-13)


### Bug Fixes

* **deployment:** remove neon workflow ([2eb16f4](https://github.com/doper1/POK/commit/2eb16f41b0ffcb6838d22637f9d8661e65f90109))

## [4.0.6](https://github.com/doper1/POK/compare/v4.0.5...v4.0.6) (2024-10-12)


### Bug Fixes

* **src:** remove log of unrelated messages ([369c812](https://github.com/doper1/POK/commit/369c8127d402a89448838737ae9a88c6863bcf98))

## [4.0.5](https://github.com/doper1/POK/compare/v4.0.4...v4.0.5) (2024-10-12)


### Bug Fixes

* **src:** pick SB/BB player ([4f931f7](https://github.com/doper1/POK/commit/4f931f74687a8503ba5b6f855e369b5f86956342))

## [4.0.4](https://github.com/doper1/POK/compare/v4.0.3...v4.0.4) (2024-10-10)


### Bug Fixes

* **src:** missing async in pre exit ([fa88e57](https://github.com/doper1/POK/commit/fa88e5754f1605c4c478026bcf82e65c5fda2126))

## [4.0.3](https://github.com/doper1/POK/compare/v4.0.2...v4.0.3) (2024-10-10)


### Bug Fixes

* **src:** message timeout and pre/inGame routing ([d07574a](https://github.com/doper1/POK/commit/d07574a680a2c49488ecb6a2d08e8d4dfd92c431))

## [4.0.2](https://github.com/doper1/POK/compare/v4.0.1...v4.0.2) (2024-10-09)


### Bug Fixes

* groups id length increase ([1018cc8](https://github.com/doper1/POK/commit/1018cc8fd792fc1d1db07c9f3250eb07a0217c4e))
* wrong help message ([675af79](https://github.com/doper1/POK/commit/675af79df5cae1f1db10b1667d908e9f84b375b9))

## [4.0.1](https://github.com/doper1/POK/compare/v4.0.0...v4.0.1) (2024-10-09)


### Bug Fixes

* post merge fixes ([cb7a322](https://github.com/doper1/POK/commit/cb7a3225d2d40be818ddf9aae80a73cd4abeea22))
* **src:** add sandbox to puppeteer client ([36a5322](https://github.com/doper1/POK/commit/36a53223b7fd9c63bcd1edc35b354ae3b8497584))

## [4.0.0](https://github.com/doper1/POK/compare/v3.1.0...v4.0.0) (2024-10-09)


### ⚠ BREAKING CHANGES

* **src:** DB integration in helper scripts
* **src:** refactor classes into models
* **src:** created repos for DB access
* **db:** schema and drizzle configuration
* **db:** full drizzle-orm setup
* **deployment:** full Docker set up

### Features

* **db:** full drizzle-orm setup ([f2ec755](https://github.com/doper1/POK/commit/f2ec755955675e0734180db9b98f58d333481454))
* **db:** schema and drizzle configuration ([9e6080e](https://github.com/doper1/POK/commit/9e6080e1eb8ed6f03c5f169bf6ad33b8dee40125))
* **deployment:** full Docker set up ([d690ee5](https://github.com/doper1/POK/commit/d690ee5ef972b19ee1709bacf887aaf98fdd5bac)), closes [#130](https://github.com/doper1/POK/issues/130)
* **deployment:** initial docker implementation ([b6dc22d](https://github.com/doper1/POK/commit/b6dc22d0b454b0e3a2124fe6a0a1539eba898a21))
* **src:** created repos for DB access ([a5bd80d](https://github.com/doper1/POK/commit/a5bd80db034aea0c76990c483c0192008ea3b662))


### Bug Fixes

* add drizzle-kit to image ([85db269](https://github.com/doper1/POK/commit/85db269f697c7d581b9654be01540ded013a979d))
* **cfg:** moved cross-env to dependencies from dev deps ([1211e50](https://github.com/doper1/POK/commit/1211e503f858ad4f4b63ae90e40c6e04a2c1e1ec))
* **cfg:** remove --watch from 'npm start' ([47badce](https://github.com/doper1/POK/commit/47badce656a3d3dc408a445f59184404e58ab384))
* **ci:** renamed release workflow for clarity ([52968e4](https://github.com/doper1/POK/commit/52968e4d45fe4349231863335dc390953a730678))


### Code Refactoring

* **src:** DB integration in helper scripts ([9629cee](https://github.com/doper1/POK/commit/9629ceeb64ec614b7ce8f069361b82d75d594b65))
* **src:** refactor classes into models ([8fba983](https://github.com/doper1/POK/commit/8fba983a7face9f38bb6837e7aa60053e209fc62))

## [3.1.0](https://github.com/doper1/POK/compare/v3.0.1...v3.1.0) (2024-09-20)


### Features

* **src:** add simple logging of messages to console ([d8103ed](https://github.com/doper1/POK/commit/d8103edd69889ea3ef5cc1ff776fa5c33a2341c9))

## [3.0.1](https://github.com/doper1/POK/compare/v3.0.0...v3.0.1) (2024-09-20)


### Bug Fixes

* **src:** 'pok end' now waits for the hand to end ([81f582b](https://github.com/doper1/POK/commit/81f582b7f38f464c5cae7569e6221322ead12c97))
* **src:** player removal upon exit ([cf247fc](https://github.com/doper1/POK/commit/cf247fcc0d6362baa8cb0e7a23a1eb2214b68f1c))

## [3.0.0](https://github.com/doper1/POK/compare/v2.0.0...v3.0.0) (2024-09-19)


### ⚠ BREAKING CHANGES

* **src:** all in functionality now has no bugs
* **cfg:** new release workflow with please-release

### Features

* **docs:** will release-please work? ([fc506fe](https://github.com/doper1/POK/commit/fc506fe477340bc44d206c91afe7934df72eece6))
* **src:** add option to buy while joining ([ec40ae7](https://github.com/doper1/POK/commit/ec40ae749cbbd97d353a2de180a1647910435ec4))
* **src:** add player limit of 23 players ([1008c96](https://github.com/doper1/POK/commit/1008c96005717ec59c405d430582797692ae9494))


### Bug Fixes

* **cfg:** new release workflow with please-release ([f863dad](https://github.com/doper1/POK/commit/f863dade6cd9b2d1a9f057d4afef2f484c0d9885))
* **cfg:** remove old semantic-release traces ([6acc8a1](https://github.com/doper1/POK/commit/6acc8a173c3d7d97dfb6aea87a55b635c8ec1d6e))
* **cfg:** remove semantic-release from deps and release workflow" ([50b6881](https://github.com/doper1/POK/commit/50b688186656c0decb99c0a9edf6bfc0699a84ec))
* **cfg:** trying to triggering release ([7a740be](https://github.com/doper1/POK/commit/7a740beca2c0c2a4973722add17999869aaa8dfa))
* **src:** all in functionality now has no bugs ([084df8d](https://github.com/doper1/POK/commit/084df8d294a8b2cf47e8a61aebc2fa61f43ec6e2))
