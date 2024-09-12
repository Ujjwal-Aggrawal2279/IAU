import frappe
import csv
import io

@frappe.whitelist(allow_guest=True)
def get_translations(lang):
    """
    Get translations for the requested language.
    """
    translations = {}
    
    if lang in ['en', 'ar']:
        # Determine the file path based on the requested language
        file_name = f'{lang}.csv'
        file_path = frappe.get_app_path('iau', 'translations', file_name)
        
        try:
            with open(file_path, 'r', encoding='utf-8') as file:
                reader = csv.reader(file)
                next(reader)  # Skip header row
                for row in reader:
                    if row:
                        key, value = row
                        translations[key] = value
        except FileNotFoundError:
            frappe.log_error(f'Translation file not found: {file_name}')
    
    return translations
