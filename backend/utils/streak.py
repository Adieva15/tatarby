from datetime import date, timedelta

def update_streak(user, db):
    today = date.today()
    yesterday = today - timedelta(days=1)

    if user.last_activity_date is None:
        user.current_streak = 1
    elif user.last_activity_date == today:
        return
    elif user.last_activity_date == yesterday:
        user.current_streak += 1
    else:
        user.current_streak = 1

    if user.current_streak > user.longest_streak:
        user.longest_streak = user.current_streak

    user.last_activity_date = today
    db.commit()