import zipfile
import os
import shutil
import xml.etree.ElementTree as ET

BACKEND_UPLOADS = r"d:\Car parts\Backend\uploads\products"
FRONTEND_UPLOADS = r"d:\Car parts\Frontend\public\uploads\products"

os.makedirs(BACKEND_UPLOADS, exist_ok=True)
os.makedirs(FRONTEND_UPLOADS, exist_ok=True)

DOC_FILES = [
    (r"d:\Car parts\Backend\doc\BMW OEM bumper  assembly .xlsx", "bumper_assy"),
    (r"d:\Car parts\Backend\doc\BMW OEM bumper shell  .xlsx", "bumper_shell"),
    (r"d:\Car parts\Backend\doc\headlight OEM  BMW .xlsx", "headlight_bmw"),
]

mapping_output = {}

for file_path, prefix in DOC_FILES:
    if not os.path.exists(file_path):
        continue
    print(f"Processing: {file_path}")
    z = zipfile.ZipFile(file_path)
    if "xl/drawings/drawing1.xml" not in z.namelist() or "xl/drawings/_rels/drawing1.xml.rels" not in z.namelist():
        print(f"  No drawing relationships found for {prefix}")
        continue
    
    tree = ET.fromstring(z.read("xl/drawings/drawing1.xml"))
    rels = ET.fromstring(z.read("xl/drawings/_rels/drawing1.xml.rels"))
    rel_map = {r.attrib["Id"]: r.attrib["Target"].split("/")[-1] for r in rels}
    ns = {
        "xdr": "http://schemas.openxmlformats.org/drawingml/2006/spreadsheetDrawing",
        "a": "http://schemas.openxmlformats.org/drawingml/2006/main",
    }
    
    row_to_img = {}
    for anchor in tree:
        row_el = anchor.find(".//xdr:from/xdr:row", ns)
        blip = anchor.find(".//a:blip", ns)
        if row_el is not None and blip is not None:
            rId = blip.attrib.get("{http://schemas.openxmlformats.org/officeDocument/2006/relationships}embed")
            img_file = rel_map.get(rId)
            if img_file:
                row_idx = int(row_el.text)
                row_to_img[row_idx] = img_file
    
    mapping_output[prefix] = {}
    for row_idx, img_name in row_to_img.items():
        zip_img_path = f"xl/media/{img_name}"
        if zip_img_path in z.namelist():
            ext = os.path.splitext(img_name)[1] or ".jpg"
            dest_filename = f"{prefix}_row_{row_idx}{ext}"
            dest_backend = os.path.join(BACKEND_UPLOADS, dest_filename)
            dest_frontend = os.path.join(FRONTEND_UPLOADS, dest_filename)
            
            with z.open(zip_img_path) as src, open(dest_backend, "wb") as dst:
                shutil.copyfileobj(src, dst)
            shutil.copyfile(dest_backend, dest_frontend)
            
            mapping_output[prefix][row_idx] = f"/uploads/products/{dest_filename}"

print("Image extraction complete!")
for k, v in mapping_output.items():
    print(f"  {k}: {len(v)} images extracted and saved.")
