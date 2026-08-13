from pathlib import Path

app=Path('app.jsx')
s=app.read_text()
old='''  const renderOverview = () => <div>\n    {renderTodayV69()}\n    {renderProfileCard()}\n    {renderCalendar()}\n  </div>;'''
new='''  const renderOverview = () => <div>\n    {renderProfileCard()}\n    {renderCalendar()}\n    {renderTodayV69()}\n  </div>;'''
if old not in s:
    raise SystemExit('renderOverview order anchor missing')
app.write_text(s.replace(old,new,1))

audit=Path('scripts/audit-today-v69.py')
a=audit.read_text()
old_need=''' "{renderTodayV69()}\\n    {renderProfileCard()}", "game-calendar-v69"'''
new_need=''' "{renderProfileCard()}\\n    {renderCalendar()}\\n    {renderTodayV69()}", "game-calendar-v69"'''
if old_need not in a:
    raise SystemExit('today audit order anchor missing')
audit.write_text(a.replace(old_need,new_need,1))
print('overview order moved to profile -> calendar -> today')
