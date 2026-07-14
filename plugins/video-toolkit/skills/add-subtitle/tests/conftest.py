import sys
from pathlib import Path

# 让 tests/ 可以 import 上级目录的 skill_main
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
