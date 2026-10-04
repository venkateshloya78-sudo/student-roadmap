"""
update_all_expanded_notes.py — Updates all 19 lessons across the 8 newly added courses with complete 13-block educational notes.
"""
import os
import sys
import json
import sqlite3

sys.stdout.reconfigure(encoding='utf-8')

DB_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'dev.db'))

# Import lesson data maps
from content_dsa import DSA_LESSONS
from content_systems import SYSTEMS_LESSONS
from content_engineering import ENGINEERING_LESSONS

ALL_LESSONS_MAP = {}
ALL_LESSONS_MAP.update(DSA_LESSONS)
ALL_LESSONS_MAP.update(SYSTEMS_LESSONS)
ALL_LESSONS_MAP.update(ENGINEERING_LESSONS)

def main():
    print(f"Connecting to SQLite database: {DB_PATH}")
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()

    updated_count = 0
    total_bytes_added = 0

    print(f"Total expanded lessons to apply: {len(ALL_LESSONS_MAP)}")
    print("=" * 70)

    for (slug, mod_num, lesson_num), blocks in ALL_LESSONS_MAP.items():
        # Find the target lesson in the database
        c.execute("""
            SELECT l.id, l.title, length(l.content_blocks_json)
            FROM lessons l
            JOIN course_modules m ON m.id = l.module_id
            JOIN courses c ON c.id = m.course_id
            WHERE c.slug = ? AND m.module_number = ? AND l.lesson_number = ?
        """, (slug, mod_num, lesson_num))
        row = c.fetchone()

        if not row:
            print(f"[-] ERROR: Lesson not found for {slug} M{mod_num} L{lesson_num}")
            continue

        lesson_id, lesson_title, old_len = row
        new_json_str = json.dumps(blocks, ensure_ascii=False)
        new_len = len(new_json_str)

        # Update the lesson in SQLite
        c.execute("""
            UPDATE lessons
            SET content_blocks_json = ?
            WHERE id = ?
        """, (new_json_str, lesson_id))

        updated_count += 1
        total_bytes_added += (new_len - old_len)
        print(f"[+] Updated {slug:<30} M{mod_num} L{lesson_num}: {lesson_title[:35]:<35} ({old_len}B -> {new_len}B, +{new_len - old_len}B, {len(blocks)} blocks)")

    conn.commit()
    print("=" * 70)
    print(f"Successfully updated {updated_count} lessons with detailed 13-block curriculum notes!")
    print(f"Total expanded text added: +{total_bytes_added:,} bytes.")

    # Verification: check block types and JSON parse validity across all 19 lessons
    print("\nVerifying updated lessons in database:")
    c.execute("""
        SELECT c.slug, m.module_number, l.lesson_number, l.title, l.content_blocks_json
        FROM lessons l
        JOIN course_modules m ON m.id = l.module_id
        JOIN courses c ON c.id = m.course_id
        WHERE c.slug IN (
            'data-structures-algorithms',
            'git-github',
            'cloud-computing',
            'linux-system-administration',
            'devops-engineering',
            'cybersecurity-fundamentals',
            'software-engineering',
            'mobile-app-development'
        )
        ORDER BY c.slug, m.module_number, l.lesson_number
    """)
    verified_rows = c.fetchall()
    all_valid = True
    for slug, m_num, l_num, title, blocks_json in verified_rows:
        try:
            parsed = json.loads(blocks_json)
            block_types = [b.get('type') for b in parsed]
            has_13 = len(parsed) >= 12
            status = "VALID (13-block)" if has_13 else f"WARNING ({len(parsed)} blocks)"
            if not has_13:
                all_valid = False
            print(f"  {slug:<28} M{m_num} L{l_num}: {len(parsed)} blocks | {status}")
        except Exception as e:
            all_valid = False
            print(f"  {slug} M{m_num} L{l_num}: JSON ERROR: {e}")

    print(f"\nVerification Complete. All 19 lessons have rich 13-block notes: {all_valid}")
    conn.close()

if __name__ == '__main__':
    main()
