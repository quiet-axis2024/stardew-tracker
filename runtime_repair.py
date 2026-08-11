from pathlib import Path
p=Path('app.jsx')
s=p.read_text(encoding='utf-8')
old='''<div style={{position:"fixed",left:0,right:0,bottom:0,zIndex:50,background:"rgba(61,34,15,.98)",borderTop:`3px solid ${C.gold}`,display:"grid",gridTemplateColumns:"repeat(5,minmax(0,1fr))",padding:"4px 5px calc(4px + env(safe-area-inset-bottom))",boxShadow:"0 -3px 10px rgba(0,0,0,.18)"}}>'''
new='''<div style={{position:"fixed",left:0,right:0,bottom:0,zIndex:50,background:"rgba(61,34,15,.98)",borderTop:`3px solid ${C.gold}`,display:"grid",gridTemplateColumns:"repeat(6,minmax(0,1fr))",padding:"4px 5px calc(4px + env(safe-area-inset-bottom))",boxShadow:"0 -3px 10px rgba(0,0,0,.18)"}}>'''
if old not in s: raise SystemExit('bottom nav marker missing')
s=s.replace(old,new,1)
p.write_text(s,encoding='utf-8')
print('v30 bottom navigation fixed')