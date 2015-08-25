<a name="v4.1.8"></a>
# v4.1.8 (2015-08-17)

## :bug: Bug Fixes

- Fix error still raised when reading the diffs from a destroyed repo ([68544885](https://github.com/atom-minimap/minimap-git-diff/commit/68544885bc51c841da0419465dd7dc260bf50ade), [#14](https://github.com/atom-minimap/minimap-git-diff/issues/14))

<a name="v4.1.7"></a>
# v4.1.7 (2015-07-14)

## :bug: Bug Fixes

- Fix error raised when opening a non existing file ([eb450b2c](https://github.com/atom-minimap/minimap-git-diff/commit/eb450b2ceec2f216ecc0b5600b100754880b3d6a), [#16](https://github.com/atom-minimap/minimap-git-diff/issues/16))
- Fix looping over array while it's actually a Map ([6e7265a5](https://github.com/atom

<a name="v4.1.6"></a>
# v4.1.6 (2015-07-10)

## :bug: Bug Fixes

- Fix error raised if no editorsMinimap doesn't exist yet ([c8acb713](https://github.com/atom-minimap/minimap-git-diff/commit/c8acb713c5f9aeb0afc12980e4d7e1c88772197b), [#16](https://github.com/atom-minimap/minimap-git-diff/issues/16))

<a name="v4.1.5"></a>
# v4.1.5 (2015-07-10)

## :bug: Bug Fixes

- Fix leak bindings ([c1c836c8](https://github.com/atom-minimap/minimap-git-diff/commit/c1c836c8b0f5ce98a737889319c2943dcc3af6f8))


<a name="v4.1.4"></a>
# v4.1.4 (2015-07-08)

## :bug: Bug Fixes

- Destroy binding when the repository is destroyed ([4ba6e8d1](https://github.com/atom-minimap/minimap-git-diff/commit/4ba6e8d1b19fc286b6bebbd85e91ea79a315a677), [#12](https://github.com/atom-minimap/minimap-git-diff/issues/12))


<a name="v4.1.3"></a>
# v4.1.3 (2015-05-18)

## :bug: Bug Fixes

- Fix issues with project using more than one repo ([19d6fd28](https://github.com/atom-minimap/minimap-git-diff/commit/19d6fd28d81142b5ebe67d4df4e69ef014a3030d), [#12](https://github.com/atom-minimap/minimap-git-diff/issues/12))

## :racehorse: Performances

- Avoid updating on every change ([893ae34f](https://github.com/atom-minimap/minimap-git-diff/commit/893ae34fc6ac85e885a3e8b555485f9b8e1510eb))

<a name="v4.1.2"></a>
# v4.1.2 (2015-03-01)

## :bug: Bug Fixes

- Fix bad plugin name in registration ([8ab229a2](https://github.com/atom-minimap/minimap-git-diff/commit/8ab229a2e8a0930f682e6fb9c121c7d6bf7e5d29))

<a name="v4.1.1"></a>
# v4.1.1 (2015-03-01)

## :sparkles: Features

- Implement minimap service consumer ([cb81bb3a](https://github.com/atom-minimap/minimap-git-diff/commit/cb81bb3ae8b6d844eb2299c1f83b854a10f4b53f))

<a name="v4.0.0"></a>
# v4.0.0 (2015-02-22)

## :truck: Migration

- Migrate to atom-minimap organization ([838a7ad3](https://github.com/atom-minimap/minimap-git-diff/commit/838a7ad307d764d308f9bb948714713f8d60a593))

<a name="v3.1.2"></a>
# v3.1.2 (2015-02-19)

## :bug: Bug Fixes

- Fix broken binding when `getRepositories` returns `[null]` ([ad89d101](https://github.com/atom-minimap/minimap-git-diff/commit/ad89d101cbcc93ee3d2e084bfd03bc34b60f786a), [#5](https://github.com/atom-minimap/minimap-git-diff/issues/5))

<a name="v3.1.1"></a>
# v3.1.1 (2015-01-26)

## :bug: Bug Fixes

- Fix deprecations ([89e22169](https://github.com/atom-minimap/minimap-git-diff/commit/89e22169a1bdbb476771784c9474b21b5e40f561))

<a name="v3.1.0"></a>
# v3.1.0 (2015-01-05)

## :sparkles: Features

- Implement support for both v3 and v4 API ([84f2b31b](https://github.com/atom-minimap/minimap-git-diff/commit/84f2b31b95ddd7f556c31ac622970c928c500c0e))

<a name="v3.0.11"></a>
# v3.0.11 (2014-12-05)

## :bug: Bug Fixes

- Fix error still raised when adding marker to a destroyed buffer ([afc00dd7](https://github.com/atom-minimap/minimap-git-diff/commit/afc00dd79a7aff44fcbdc4840b0eee79376bfdb7))

<a name="v3.0.10"></a>
# v3.0.10 (2014-12-05)

- Remove warning and prevent marker creation if editor was destroyed

<a name="v3.0.9"></a>
# v3.0.9 (2014-12-05)

## :bug: Bug Fixes

- Fix use of deprecated minimap API ([8770ea30](https://github.com/atom-minimap/minimap-git-diff/commit/8770ea3070532a00d3d82621961065e52f420118))
- Fix broken plugin with latest minimap changes ([b1a2e958](https://github.com/atom-minimap/minimap-git-diff/commit/b1a2e958d6d2731a51f0239ca12156521ebbd1d3))

<a name="v3.0.8"></a>
# v3.0.8 (2014-10-29)

- Use `atom-utils` for packages requires.
- Add defensive code in `markRange` for the case the text editor is destroyed.

## :bug: Bug Fixes

- Fix requiring packages by using a promise ([38096519](https://github.com/atom-minimap/minimap-git-diff/commit/3809651918431541db84a4dbc05502dbe5440f11))

<a name="v3.0.6"></a>
# v3.0.6 (2014-10-23)

## :bug: Bug Fixes

- Fix requiring packages by using a promise ([38096519](https://github.com/atom-minimap/minimap-git-diff/commit/3809651918431541db84a4dbc05502dbe5440f11))

<a name="v3.0.5"></a>
# v3.0.5 (2014-10-22)

## :bug: Bug Fixes

- Fix access to packages dependencies ([422ef35a](https://github.com/atom-minimap/minimap-git-diff/commit/422ef35ae21f1bb6d3eb8057757599af5e457292))

<a name="v3.0.4"></a>
# v3.0.4 (2014-09-24)

## :bug: Bug Fixes

- Fix missing hook on project events ([a600e632](https://github.com/atom-minimap/minimap-git-diff/commit/a600e63241c57a37d65bf38b703c69a8253f9324), [#1](https://github.com/atom-minimap/minimap-git-diff/issues/1))

<a name="v3.0.3"></a>
# v3.0.3 (2014-09-20)

## :bug: Bug Fixes

- Fix remaining call to unsubscribe in binding ([9f5a639f](https://github.com/atom-minimap/minimap-git-diff/commit/9f5a639f23aeb184a89769b1f788e51ea95ce739))

<a name="v3.0.2"></a>
# v3.0.2 (2014-09-19)

## :bug: Bug Fixes

- Fix broken activation due to renamed event in nightly ([15cafb4d](https://github.com/atom-minimap/minimap-git-diff/commit/15cafb4d6d13444944a2609ce6d22f0f55454c73))

<a name="v3.0.1"></a>
# v3.0.1 (2014-09-19)

## :bug: Bug Fixes

- Fix broken version test ([a6cca133](https://github.com/atom-minimap/minimap-git-diff/commit/a6cca133f70aef9e6ae9c1c81117145939443330))

<a name="v3.0.0"></a>
# v3.0.0 (2014-09-19)

## :sparkles: Features

- Add version test for upcoming version ([0f49e791](https://github.com/atom-minimap/minimap-git-diff/commit/0f49e7914e6e8d3c66df6f7e548c145d03199c1b))
- Implement support for the new minimap decoration API ([8a2835ee](https://github.com/atom-minimap/minimap-git-diff/commit/8a2835ee74a45e1fbc0b7966cd5cc5f9cc51d247))

## :bug: Bug Fixes

- Fix buffer subscription never disposed ([92a49acc](https://github.com/atom-minimap/minimap-git-diff/commit/92a49accd32e3b320a7ab03cd20e2682cfc4b84b))
- Fix deprecated minimap methods calls ([cbc02e7b](https://github.com/atom-minimap/minimap-git-diff/commit/cbc02e7b6a63995ac99ab1684819bedd339e68e4))
- Fix merge conflict ([03864b4c](https://github.com/atom-minimap/minimap-git-diff/commit/03864b4cee3f9454f9b4fd542cdf65732fcb645e))
- Fix typo in decorations scopes ([bf32873d](https://github.com/atom-minimap/minimap-git-diff/commit/bf32873d7497ead614a26b19e6b1d98e2a400187))
- Fix deprecation methods calls ([c16ba063](https://github.com/atom-minimap/minimap-git-diff/commit/c16ba0630f1aa60986b5546c9220ef7009068e32))
- Fix deprecated calls to event subscription ([68a1f5f3](https://github.com/atom-minimap/minimap-git-diff/commit/68a1f5f3d669483d1fa8004726a7de340b0c2db1))
- Fix legacy code remaining in deactivate ([a7e925ef](https://github.com/atom-minimap/minimap-git-diff/commit/a7e925ef73975aed65e715c30180812995ba2d30))

<a name="v1.0.1"></a>
# v1.0.1 (2014-08-19)

## :bug: Bug Fixes

- Fix CHANGELOG not being at the right place ([af3555fb](https://github.com/atom-minimap/minimap-git-diff/commit/af3555fb40d93607022c7177025f0d8de0a1d7b1))

<a name="v1.0.0"></a>
# v1.0.0 (2014-08-16)

## :sparkles: Features

- Add listener on screen-lines-changed instead of contents-modified ([f4dfa658](https://github.com/atom-minimap/minimap-git-diff/commit/f4dfa658fc6cc2317d7e50984b1df989d3f819b5))


<a name="v0.6.0"></a>
# v0.6.0 (2014-05-11)

## :sparkles: Features

- Adds minimap version test in activate method ([d1bf1bcb](https://github.com/atom-minimap/minimap-git-diff/commit/d1bf1bcbfda071e8618c98f0700e4901810bd0bc))


<a name="v0.5.1"></a>
# v0.5.1 (2014-05-02)

## :bug: Bug Fixes

- Fixes diffs disappearing on minimap toggle ([f497ce8f](https://github.com/atom-minimap/minimap-git-diff/commit/f497ce8f35f4255b25b69df272d5b1412fc505f2))


<a name="v0.4.0"></a>
# v0.4.0 (2014-04-08)

## :sparkles: Features

- Adds isActive plugin method ([0e89c371](https://github.com/atom-minimap/minimap-git-diff/commit/0e89c371e2c77547397f4574e71075a4cdfef4c0))


<a name="v0.2.1"></a>
# v0.2.1 (2014-04-04)

## :sparkles: Features

- Adds link to minimap in README ([c3fb883a](https://github.com/atom-minimap/minimap-git-diff/commit/c3fb883a0479ebb9df1818c0cb322883ae499e85))


<a name="v0.2.0"></a>
# v0.2.0 (2014-04-04)

## :bug: Bug Fixes

- Fix error raised on untracked files ([c7a8a0f6](https://github.com/atom-minimap/minimap-git-diff/commit/c7a8a0f6bc1d5c2b57b48d1dbb4db9f121177129), [#1](https://github.com/atom-minimap/minimap-git-diff/issues/1))


<a name="v0.1.0"></a>
# v0.1.0 (2014-04-03)

## :sparkles: Features

- Adds screenshot ion README ([b413fec7](https://github.com/atom-minimap/minimap-git-diff/commit/b413fec7200efd6fd5fda73eb3147c7dc3572fd8))
- Adds screenshot ([3b3bd8d9](https://github.com/atom-minimap/minimap-git-diff/commit/3b3bd8d9a2d8aa46ca033255eedb942f4a5d1445))
- Adds hooks on minimap updates ([7eeb6d1d](https://github.com/atom-minimap/minimap-git-diff/commit/7eeb6d1da2801112218ff304d7891b40494f770f))
- Implements the minimap diff display and update ([74b8b478](https://github.com/atom-minimap/minimap-git-diff/commit/74b8b478b165d0ef62a859a5593196ccb3e97e33))  
