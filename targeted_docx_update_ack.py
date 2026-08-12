import docx
import sys

try:
    doc = docx.Document('SmartMBG_Yoga Ari Anggoro_Icasvi_UIUX.docx')
except Exception as e:
    print(f"Error opening file: {e}")
    sys.exit(1)

replacements = {
    # Paragraph 2
    "whose cooperation and valuable input greatly contributed to the analysis, system design, and evaluation of the SmartMBG platform.": "whose cooperation and valuable input during the empathy research and usability testing greatly contributed to the UI/UX design and evaluation of the SmartMBG platform.",
    
    # Paragraph 3
    "All authors contributed to the conceptualization, system design, software development, data analysis, manuscript preparation, and approved the final version of the manuscript.": "All authors contributed to the conceptualization, UI/UX design, wireframing, usability testing data analysis, manuscript preparation, and approved the final version of the manuscript."
}

for p in doc.paragraphs:
    original_text = p.text
    new_text = original_text
    
    for search_key, replace_text in replacements.items():
        if search_key in new_text:
            new_text = new_text.replace(search_key, replace_text)
            
    if new_text != original_text:
        p.text = new_text

try:
    doc.save('SmartMBG_Yoga Ari Anggoro_Icasvi_UIUX.docx')
    print("SUCCESS: Acknowledgement fully updated!")
except Exception as e:
    print(f"Error saving: {e}")
