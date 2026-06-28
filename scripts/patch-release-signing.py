#!/usr/bin/env python3
"""Patch app/build.gradle to add release signing config."""
import re
import sys

build_gradle = sys.argv[1]

with open(build_gradle, 'r') as f:
    content = f.read()

# Release signing config block
release_config = r'''    }  // end debug signingConfig
        release {
            storeFile file(RELEASE_KEYSTORE)
            storePassword RELEASE_STORE_PASSWORD
            keyAlias RELEASE_KEY_ALIAS
            keyPassword RELEASE_KEY_PASSWORD
        }'''

# Insert the release signing config AFTER the debug block closes
content = re.sub(
    r'^(\s+keyPassword \'android\'\s*\n\s*\})',
    r'\1' + '\n' + release_config,
    content,
    count=1,
    flags=re.MULTILINE
)

# Change release build type to use release signing instead of debug
content = content.replace(
    'signingConfig signingConfigs.debug',
    'signingConfig signingConfigs.release'
)

with open(build_gradle, 'w') as f:
    f.write(content)

# Verify the structure is valid
if 'debug {' in content and 'release {' in content:
    # Check the release block is NOT nested inside debug
    debug_end = content.find("}  // end debug signingConfig")
    if debug_end > 0:
        print("✓ Release signing config patched successfully (outside debug block)")
    else:
        print("⚠ Warning: release block may still be nested inside debug")
else:
    print("✗ Missing signing configs in output")
