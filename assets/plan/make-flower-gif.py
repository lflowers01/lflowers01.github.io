"""Build the one-shot growth animation while preserving the old icon's pixels."""
from pathlib import Path
from PIL import Image, ImageDraw

root = Path(__file__).resolve().parent
source = Image.open(root / "flower-original.png").convert("RGB")
bloom = source.crop((3, 3, 35, 28))
frames = []
for index in range(22):
    progress = index / 21
    frame = source.copy()
    draw = ImageDraw.Draw(frame)
    draw.rectangle((3, 3, 34, 42), fill="white")
    stem = min(1, progress / .53)
    if stem:
        draw.rectangle((18, 42 - round(17 * stem), 19, 42), fill="black")
    leaves = min(1, max(0, (progress - .20) / .45))
    if leaves:
        for y in range(33, 43):
            for x in range(3, 35):
                if abs(x - 18.5) <= 16 * leaves and source.getpixel((x, y)) == (0, 0, 0):
                    draw.point((x, y), fill="black")
    growth = min(1, max(0, (progress - .45) / .55))
    if growth:
        width = max(1, round(32 * growth))
        height = max(1, round(25 * growth))
        flower = bloom.resize((width, height), Image.Resampling.NEAREST)
        frame.paste(flower, (19 - (width + 1) // 2, 28 - height))
    frames.append(frame)
frames[-1] = source.copy()
frames[0].save(root / "flower-grow.gif", save_all=True, append_images=frames[1:],
               duration=[40] * 21 + [1070], disposal=2, optimize=False)

with Image.open(root / "flower-grow.gif") as result:
    assert result.n_frames > 10 and "loop" not in result.info
    result.seek(result.n_frames - 1)
    assert result.convert("RGB").tobytes() == source.tobytes()
print("One-shot GIF written; final frame matches the original icon exactly.")
