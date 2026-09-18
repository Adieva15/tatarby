import pytesseract
from PIL import Image

def ocr_image(image_path: str, lang: str = "tat_cyrl", psm: int = 3) -> str:
    image = Image.open(image_path)
    text = pytesseract.image_to_string(
        image,
        lang=lang,
        config=f"--psm {psm}"
    )
    return text