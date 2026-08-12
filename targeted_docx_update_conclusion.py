import docx
import sys

try:
    doc = docx.Document('SmartMBG_Yoga Ari Anggoro_Icasvi_UIUX.docx')
except Exception as e:
    print(f"Error opening file: {e}")
    sys.exit(1)

replacements = {
    # Paragraph 1
    "This study successfully achieved its research objective by designing and developing SmartMBG, an integrated web-based platform to support the implementation of Indonesia's Free Nutritious Meal Program (MBG).": "This study successfully achieved its objective by designing an intuitive User Interface (UI) and User Experience (UX) for SmartMBG, a digital monitoring platform supporting Indonesia's Free Nutritious Meal Program (MBG).",
    
    "The proposed platform integrates Artificial Intelligence (AI), WebGIS, and circular economy principles to facilitate nutritional analysis, food waste management, geographic visualization, and monitoring services within a unified information system.": "By applying the Design Thinking methodology, the research produced a user-centered interface that simplifies food waste reporting, monitoring, and navigation through interactive high-fidelity prototypes developed in Figma.",
    
    "The developed architecture enables collaboration among government administrators, schools, Nutrition Fulfillment Service Units (SPPG), and waste management partners through centralized data management and real-time monitoring, thereby improving transparency, operational efficiency, and evidence-based decision-making in the implementation of the MBG program.": "The proposed design successfully bridges the technical gap for diverse users—including teachers, SPPG units, and administrators—thereby minimizing data entry errors and maximizing overall operational efficiency.",
    
    # Paragraph 2
    "The primary contribution of this research is the development of an integrated digital platform that combines AI-based nutritional analysis, WebGIS-based spatial monitoring, and circular economy concepts for sustainable food waste management.": "The primary contribution of this research is a highly evaluated UI/UX design tailored specifically for a multi-stakeholder nutritional and food waste monitoring ecosystem.",
    
    "Unlike previous studies that generally focus on a single aspect of food monitoring or geographic information systems, SmartMBG provides a comprehensive solution by integrating multiple technologies and stakeholders into a single platform.": "Unlike previous systems that rely on complex manual interfaces, the SmartMBG prototype demonstrated an excellent usability score on the System Usability Scale (SUS), proving its readiness for end-users.",
    
    "Nevertheless, this research has several limitations.": "Nevertheless, this research has several limitations.",
    
    "The Artificial Intelligence module was developed and evaluated using a limited dataset, while the system evaluation primarily focused on functional testing without extensive field implementation involving multiple schools and SPPG units.": "The usability testing was conducted with a limited pool of participants, and the prototypes were evaluated in a controlled environment rather than a live field deployment.",
    
    "Therefore, future research should improve the AI model using larger and more diverse datasets, conduct broader pilot implementations in different regions, integrate Internet of Things (IoT) technologies for real-time monitoring, and develop a mobile application to improve accessibility and scalability.": "Therefore, future research should conduct broader usability testing with more diverse demographics, translate the Figma prototypes into fully functional frontend code, and explore dedicated mobile applications for easier access on smartphones.",
    
    "These future developments are expected to strengthen SmartMBG as a sustainable digital ecosystem that supports data-driven decision-making and contributes to the successful implementation of the Free Nutritious Meal Program in Indonesia.": "These future developments are expected to ensure that SmartMBG remains a sustainable, user-friendly digital ecosystem that fully supports the implementation of the Free Nutritious Meal Program in Indonesia."
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
    print("SUCCESS: Chapter 4 Conclusion fully updated!")
except Exception as e:
    print(f"Error saving: {e}")
