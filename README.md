# 🏁 DRux

`drux start` instead of `deno task start`. create a yaml file called `project.yml` in the root directory of your project. put your tasks in `tasks:`.

[Example project.yml file.](./project.yml)

[![Deno CI](https://github.com/ibodev1/drux/workflows/Deno%20CI/badge.svg)](https://github.com/ibodev1/drux/actions)
[![GitHub](https://img.shields.io/github/license/ibodev1/drux)](https://github.com/ibodev1/drux/blob/master/LICENSE)
[![Contributors](https://img.shields.io/github/contributors/ibodev1/drux)](https://github.com/ibodev1/drux/graphs/contributors)
[![drux](https://img.shields.io/badge/ibodev1-drux-brightgreen)](https://ibodev1.github.io/drux/)
[![Made by ibodev1](https://img.shields.io/badge/made%20by-ibodev1-0082fb)](https://github.com/ibodev1)
[![TypeScript](https://img.shields.io/badge/types-TypeScript-blue)](https://github.com/ibodev1/drux)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

## ⭐ Getting started

### CLI

You can also install it globally using the following:

```bash
deno install --allow-read --allow-run -n drux https://raw.githubusercontent.com/ibodev1/drux/master/cli.ts
```

Then, the package is available to run:

```bash
drux <task name>
```

Alternatively, you can use it directly from the CLI by using `deno run`:

```bash
deno run --allow-read --allow-run -n drux https://raw.githubusercontent.com/ibodev1/drux/master/cli.ts <task name>
```

### CLI with [DPX](https://github.com/denorg/dpx)

After [installing DPX](https://github.com/denorg/dpx), you can directly use the CLI using the `dpx` command:

```bash
dpx --allow-read --allow-run drux <task name>
```

### Configuration

Required permissions:

1. `--allow-read`
2. `--allow-run`

## 👩‍💻 Development

Run tests:

```bash
deno test --allow-read --allow-run
```

## 📄 License

MIT © [ibodev1](https://ibodev1.github.io)
