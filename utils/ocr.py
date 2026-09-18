import pytesseract
from PIL import Image
from pydantic import BaseModel

def ocr_image(image_path: str, lang: str = "tat_cyrl", psm: int = 3) -> str:
    image = Image.open(image_path)
    text = pytesseract.image_to_string(
        image,
        lang=lang,
        config=f"--psm {psm}"
    )
    return text


class OcrResponse(BaseModel):
    text: str
