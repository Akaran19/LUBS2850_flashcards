import csv
import json
import re
import unicodedata

# 1. Define your buckets for categorization
mapping = {
    'Price':        '4Ps: Price',
    'Promotion':    '4Ps: Promotion',
    'Product':      '4Ps: Product',
    'Place':        '4Ps: Place',
    'Segmentation': 'Segmentation',
    'Targeting':    'Segmentation',
    'PEST':         'PEST Analysis',
    'SWOT':         'SWOT Analysis',
    'Brand':        'Branding',
    # …add more rules as you like
}

def categorize(text):
    """Return the first category whose keyword appears in text, else 'Other'."""
    text_l = text.lower()
    for kw, cat in mapping.items():
        if kw.lower() in text_l:
            return cat
    return 'Other'

def sanitize_text(text):
    """Clean up text by removing problematic Unicode characters"""
    if not text:
        return ""
    
    # Normalize Unicode (e.g., convert composed characters to their base form + diacritic)
    text = unicodedata.normalize('NFC', text)
    
    # Replace specific problematic Unicode characters
    # Add more specific replacements as needed
    replacements = {
        '\u00c0': 'A',    # À
        '\u8192': ' ',    # Medium mathematical space
        '\u2018': "'",    # Left single quotation mark
        '\u2019': "'",    # Right single quotation mark
        '\u201c': '"',    # Left double quotation mark
        '\u201d': '"',    # Right double quotation mark
        '\u2013': '-',    # En dash
        '\u2014': '--',   # Em dash
        '\u00a0': ' ',    # Non-breaking space
    }
    
    for char, replacement in replacements.items():
        text = text.replace(char, replacement)
    
    # Remove control characters
    text = re.sub(r'[\x00-\x1F\x7F-\x9F]', '', text)
    
    # Replace multiple spaces with a single space
    text = ' '.join(text.split())
    
    return text.strip()

# 2. Read CSV and build JSON array
input_file  = 'terms.csv'
output_file = 'terms.json'
data = []

with open(input_file, newline='', encoding='utf-8') as csvfile:
    reader = csv.DictReader(csvfile)
    for row in reader:
        question = sanitize_text(row['Question'])
        # Remove all backslashes and collapse any extra spaces
        raw_answer = row['Answer'].replace('\\', ' ')
        answer = sanitize_text(raw_answer)
        
        item = {
            'id':        sanitize_text(row['ID']),
            'question':  question,
            'answer':    answer,
            'category':  categorize(answer)
        }
        data.append(item)

# 3. Write out to JSON
with open(output_file, 'w', encoding='utf-8') as jsonfile:
    json.dump(data, jsonfile, ensure_ascii=False, indent=2)

print(f"Wrote {len(data)} entries to {output_file}")
