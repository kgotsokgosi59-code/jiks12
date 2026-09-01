#!/usr/bin/env bash
# Reinstalls the browser-check toolchain. The sandbox resets installed packages
# and ~/.cache between sessions, so run this once per session before auditing:
#
#   bash setup_check_env.sh
#
set -e
pip install playwright
sudo -n python3 -m playwright install-deps chromium firefox webkit
python3 -m playwright install chromium firefox webkit
echo "Done. Now start the site server, then: python3 audit_a11y.py && python3 browser_check.py"
