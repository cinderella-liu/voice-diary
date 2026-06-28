#!/usr/bin/env python3
"""Replace entire signingConfigs block to add release signing config."""
import re
import sys

build_gradle = sys.argv[1]

with open(build_gradle, 'r') as f:
    content = f.read()

# Replace the entire signingConfigs block (from 'signingConfigs {' to its closing '}')
old_block = r'''    signingConfigs {
        debug {
            storeFile file('debug.keystore')
            storePassword 'android'
            keyAlias 'androiddebugkey'
            keyPassword 'android'
        }
    }'''

new_block = r'''    signingConfigs {
        debug {
            storeFile file('debug.keystore')
            storePassword 'android'
            keyAlias 'androiddebugkey'
            keyPassword 'android'
        }
        release {
            storeFile file(RELEASE_KEYSTORE)
            storePassword RELEASE_STORE_PASSWORD
            keyAlias RELEASE_KEY_ALIAS
            keyPassword RELEASE_KEY_PASSWORD
        }
    }'''

content = content.replace(old_block, new_block)

# Change release build type to use release signing config
content = content.replace(
    'signingConfig signingConfigs.debug',
    'signingConfig signingConfigs.release'
)

with open(build_gradle, 'w') as f:
    f.write(content)

# Verify
if 'signingConfigs {\n        debug' in content and 'signingConfigs {\n        debug' in content:
    # Count release signing configs inside signingConfigs
    if 'release {' in content:
        print("✓ Release signing config patched successfully (block replacement)")
    else:
        print("✗ Release block not found")
else:
    print("✗ signingConfigs block not found")
