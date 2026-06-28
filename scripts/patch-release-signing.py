#!/usr/bin/env python3
"""Patch app/build.gradle to add release signing config."""

import re
import sys

build_gradle = sys.argv[1]

with open(build_gradle, 'r') as f:
    content = f.read()

# Add release signing config after the debug signing config block
release_config = '''        release {
            storeFile file(RELEASE_KEYSTORE)
            storePassword RELEASE_STORE_PASSWORD
            keyAlias RELEASE_KEY_ALIAS
            keyPassword RELEASE_KEY_PASSWORD
        }'''

# Insert the release signing config after the debug one
content = content.replace(
    "keyPassword 'android'",
    "keyPassword 'android'\n" + release_config
)

# Change release build type to use release signing instead of debug
content = content.replace(
    'signingConfig signingConfigs.debug',
    'signingConfig signingConfigs.release'
)

with open(build_gradle, 'w') as f:
    f.write(content)

print("✓ Release signing config patched successfully")
