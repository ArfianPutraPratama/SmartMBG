import docx
import sys

try:
    doc = docx.Document('SmartMBG_Yoga Ari Anggoro_Icasvi_UIUX.docx')
except Exception as e:
    sys.exit(1)

for p in doc.paragraphs:
    if 'to perform food recognition and nutritional estimation.' in p.text:
        p.text = p.text.replace('to perform food recognition and nutritional estimation. , while system acceptance was evaluated based on the successful execution of each functional module.', '')
        
try:
    doc.save('SmartMBG_Yoga Ari Anggoro_Icasvi_UIUX.docx')
except Exception as e:
    pass
