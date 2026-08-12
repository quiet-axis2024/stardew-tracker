from pathlib import Path
p=Path('app.jsx')
s=p.read_text(encoding='utf-8')
old='''        farmerColor: farmerColorResult.text, farmerMono: farmerMonoResult.text,\n        farmColor: farmColorResult.text, farmMono: farmMonoResult.text\n'''
new='''        farmerColor: farmerZhResult.text, farmerMono: farmerEngResult.text,\n        farmColor: farmZhResult.text, farmMono: farmEngResult.text\n'''
if old not in s:
    raise RuntimeError('missing OCR debug anchor')
p.write_text(s.replace(old,new,1),encoding='utf-8')
