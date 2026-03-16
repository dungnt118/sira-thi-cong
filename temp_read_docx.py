import zipfile
import xml.etree.ElementTree as ET

docx_path = r"e:\SIRA-PROJECTS\BAC-GROUP\documents\Orignal-Requirements-Docs\2. QUY TRÌNH\QUY TRÌNH LÀM VIỆC VỚI KHÁCH HÀNG\Quy-trinh-lam-viec-theo-tung-buoc-trong-CUSTOMOR JOURNEY.docx"

try:
    with zipfile.ZipFile(docx_path) as docx:
        tree = ET.XML(docx.read('word/document.xml'))
        namespaces = {'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}
        text_elements = tree.findall('.//w:t', namespaces)
        text = ''.join([node.text for node in text_elements if node.text])
        print("--- EXTRACTED TEXT ---")
        # Split text somewhat logically by looking for common headings or just print chunks
        import re
        # Basic heuristic: add newlines before capitalized words or numbers that look like list items
        formatted_text = re.sub(r'([A-Z0-9IVX]+\.)|(Bước\s+\d+)', r'\n\1\2', text)
        print(formatted_text[:4000]) # Print first 4k chars to avoid overwhelming
except Exception as e:
    print(f"Error reading docx: {e}")
