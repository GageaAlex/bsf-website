"""
Drop your high-res BS4F logo (black on white) into public/ as bs4f-logo.png
Then run: python3 process-logo.py

It will:
- Remove the white background (make transparent)
- Turn all dark pixels white
- Save the result as public/bs4f-logo-white.png
"""
from PIL import Image, ImageFilter
import numpy as np
import sys

src = "public/bs4f-logo.png"
dst = "public/bs4f-logo-white.png"

try:
    img = Image.open(src).convert("RGBA")
except FileNotFoundError:
    print(f"ERROR: {src} not found. Drop your logo file there first.")
    sys.exit(1)

arr = np.array(img)

# White/near-white → transparent
white_mask = (arr[:,:,0] > 220) & (arr[:,:,1] > 220) & (arr[:,:,2] > 220)
arr[white_mask] = [0, 0, 0, 0]

# Dark → pure white
arr[~white_mask, 0] = 255
arr[~white_mask, 1] = 255
arr[~white_mask, 2] = 255
arr[~white_mask, 3] = 255

out = Image.fromarray(arr)
out = out.filter(ImageFilter.UnsharpMask(radius=1, percent=80, threshold=1))
out.save(dst, optimize=True)
print(f"Done! Saved to {dst} ({out.size[0]}x{out.size[1]}px)")
print("Refresh your browser — the logo will update automatically.")
