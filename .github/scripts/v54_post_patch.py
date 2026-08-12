from pathlib import Path

p = Path('app.jsx')
s = p.read_text(encoding='utf-8')
old = '''  const lookupRowV54 = raw => {
    const needle = normalizeItemSearchV43(raw);
    if(!needle) return null;
    return (window.SDVLookupV46?.items || []).find(row => [row?.name,row?.zh,row?.file,...(row?.aliases || [])].filter(Boolean).some(v => normalizeItemSearchV43(v) === needle)) || null;
  };
'''
new = '''  const normalizeLookupV54 = value => String(value||"").normalize("NFKC").toLowerCase().replace(/[\\s·・_'’\\-]+/g,"");
  const lookupRowV54 = raw => {
    const needle = normalizeLookupV54(raw);
    if(!needle) return null;
    return (window.SDVLookupV46?.items || []).find(row => [row?.name,row?.zh,row?.file,switchNameV47(row?.name,row?.file),...(row?.aliases || [])].filter(Boolean).some(v => normalizeLookupV54(v) === needle)) || null;
  };
'''
if old not in s:
    raise RuntimeError('v54 lookup helper anchor missing')
p.write_text(s.replace(old, new, 1), encoding='utf-8')
