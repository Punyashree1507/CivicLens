import sqlite3

def connect_db():
    return sqlite3.connect("civiclens.db")


def create_database():
    conn = connect_db()

    conn.execute("""
        CREATE TABLE IF NOT EXISTS reports (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            category TEXT NOT NULL,
            location TEXT NOT NULL,
            description TEXT,
            image TEXT,
            status TEXT DEFAULT 'Submitted'
        )
    """)

    conn.commit()
    conn.close()


def save_report(category, location, description, image):
    conn = connect_db()

    cursor = conn.execute("""
        INSERT INTO reports
        (category, location, description, image)
        VALUES (?, ?, ?, ?)
    """, (category, location, description, image))

    report_id = cursor.lastrowid

    conn.commit()
    conn.close()

    return report_id


def get_reports():
    conn = connect_db()
    conn.row_factory = sqlite3.Row

    reports = conn.execute(
        "SELECT * FROM reports ORDER BY id DESC"
    ).fetchall()

    conn.close()

    return [dict(report) for report in reports]


def update_report_status(report_id, status):
    conn = connect_db()

    conn.execute(
        "UPDATE reports SET status = ? WHERE id = ?",
        (status, report_id)
    )

    conn.commit()
    conn.close()


if __name__ == "__main__":
    create_database()
    print("CivicLens Database Ready!")