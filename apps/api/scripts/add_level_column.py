import sqlite3

conn = sqlite3.connect('C:/Users/venkatesh/.gemini/antigravity/scratch/student-roadmap/apps/api/dev.db')
c = conn.cursor()
try:
    c.execute("ALTER TABLE course_modules ADD COLUMN level VARCHAR(20) DEFAULT 'beginner'")
    conn.commit()
    print("Successfully added level column to course_modules!")
except Exception as e:
    print("Note:", e)

c.execute("PRAGMA table_info(course_modules)")
for col in c.fetchall():
    print(col)
conn.close()
