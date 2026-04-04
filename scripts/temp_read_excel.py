import pandas as pd

file_path = r"e:\SIRA-PROJECTS\BAC-GROUP\documents\Orignal-Requirements-Docs\2. QUY TRÌNH\QUY TRÌNH LÀM VIỆC VỚI KHÁCH HÀNG\Customer Junior - Hành trình trải nghiệm khách hàng.xlsx"

try:
    xl = pd.ExcelFile(file_path)
    print("Sheets:", xl.sheet_names)
    for sheet in xl.sheet_names:
        print(f"\n--- Sheet: {sheet} ---")
        df = xl.parse(sheet).fillna('')
        for idx, row in df.head(50).iterrows():
            clean_row = {k: v for k, v in row.to_dict().items() if str(v).strip() != ''}
            if clean_row:
                print(f"Row {idx}: {clean_row}")
except Exception as e:
    print(f"Error reading file: {e}")
