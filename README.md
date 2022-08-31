# keyt

[![keyt-pypi](https://img.shields.io/pypi/v/keyt.svg)](https://pypi.python.org/pypi/keyt)

keyt is a stateless password manager and generator.

**Derive don't store.**

The intent of this program is to have a password manager and generator without storing any data anywhere in any form. The password is derived from a master password.

⚠️ Every passwords are derived from your master password, if you loose it you will lose access to all your account, be carreful.

## Install CLI

```shell
pip install keyt
```

You can also use the CLI has a single file, just download [cli/keyt/cli.py](./cli/keyt/cli.py). Note that you will need to install `pyperclip` and `base58` to get full functionality.

## Usage

```txt
usage: keyt [domain] [username] [master_password] [options]

keyt stateless password manager and generator.

positional arguments:
  domain                Domain name/IP/service.
  username              Username/Email/ID.
  master_password       Master password used during the password generation.

optional arguments:
  -h, --help            show this help message and exit
  --version
  -c COUNTER, --counter COUNTER
                        An integer that can be incremented to get a new password
                        for the same account. default=0.
  -f FORMAT, --format FORMAT
                        Password format can be: 'max', 'high', 'mid', 'pin' or
                        'pin6'. default=max.
  -o, --output          Output the password, by default copy it to the
                        clipboard.
  -t [TIMER], --timer [TIMER]
                        Time before flushing the clipboard. default=20s.
```

## Examples

```text
$ keyt
domain: example.com
username: admin
master password:
Password copied to the clipboard for 20s.

$ keyt example.com admin admin
Password copied to the clipboard for 20s.

$ keyt example.com admin admin -o
Fg0XjW@a=vWi@3qGBjo|Vlic7Wo9`zVKp!{Vl_Bp

$ keyt example.com admin admin -o -f mid
5w8Hv23ZUvJCRt2t

$ keyt example.com admin admin -o -f pin
3070
```

```python
>>> from keyt import gen_password
>>> gen_password(d="example.com", u="admin", m="admin")
'Fg0XjW@a=vWi@3qGBjo|Vlic7Wo9`zVKp!{Vl_Bp'
```

## Password generation

The password is generated from 5 inputs.

### Inputs

* `domain` (d): domain, ip, service or any other string representing a password protected thing.
* `username` (u): domains's username.
* `master_password` (m): master password.
* `counter` (c) (*default*=0): an integer that can be incremented to get a new password for the same account.
* `format` (f) (*default*=max): the password's format, can be: `max`, `high`, `mid`, `pin`, `pin6`.

For more informations on the format go the the `Password formats` section.

The counter input is used to get a new password for the same account, this can be usefull to change the password without having to change your master password.

### Algorithm

1. [Scrypt](https://en.wikipedia.org/wiki/Scrypt) a password-based key derivation function is used first to generate a key with:
    * password = master_password
    * salt = username
    * n = 16384 (2^14)
    * r = 8
    * p = 2
2. [BLAKE2b](https://en.wikipedia.org/wiki/BLAKE_(hash_function)) use the key generated by scrypt to create the seed to format the password:
    * data = domain + counter + username
    * key = *scrypt output*
3. The password is formated using either `base85`, `base58` or `base10`, based on the format variable.
    * seed = *BLAKE2b output*

### Password formats

| Format | Length | Char set                                | Base                |
| ------ | ------ | --------------------------------------- | ------------------- |
| `max`  | 40     | ``[a-zA-Z0-9!#$%&()*+-;<=>?@^_`{\|}~]`` | **base85** RFC 1924 |
| `high` | 16     | ``[a-zA-Z0-9!#$%&()*+-;<=>?@^_`{\|}~]`` | **base85** RFC 1924 |
| `mid`  | 16     | `[a-zA-Z0-9]` except `[0OIl]`           | **base58**          |
| `pin`  | 4      | `[0-9]`                                 | **base10**          |
| `pin6` | 6      | `[0-9]`                                 | **base10**          |

Base85 is used has encoding because it adds special characters. The RFC 1924 is a revised version of Ascii85 but this version excludes the characters `"',./:[\] `.

Base58 is used has encoding because it only contains non ambiguous characters when printed, excluded characters: `0IOl`. It was originaly created by Satoshi Nakamoto to encode bitcoin addresses in an easly readable way.

## License

keyt is licensed under [MIT](./LICENSE).
