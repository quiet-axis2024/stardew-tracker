from pathlib import Path
p=Path('app.jsx')
s=p.read_text(encoding='utf-8')
old='''      if (!(day && day >= 1 && day <= 28)) day = null; else {
        const nums = compactDate.match(/\\d+/g) || [];
        if (nums.length >= 2) { year = Number(nums[0]); day = Number(nums[nums.length-1]); }
      }'''
new='''      if (!(day && day >= 1 && day <= 28)) day = null;'''
if s.count(old)!=1:
    raise SystemExit(f'bad OCR date fallback block count={s.count(old)}')
s=s.replace(old,new,1)
if 'compactDate' in s:
    raise SystemExit('stale compactDate reference remains')
p.write_text(s,encoding='utf-8')
print('v48 OCR postfix applied')