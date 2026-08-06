import re
from datetime import datetime, timedelta

with open("src/components/AdminDashboard.jsx", "r", encoding="utf-8") as f:
    content = f.read()

# Generate the last 8 days (including today) formatted as dd/mm
now = datetime.now()
dates = [(now - timedelta(days=i)).strftime("%d/%m") for i in range(7, -1, -1)]

old_xaxis = r'<span>20/07</span><span>21/07</span><span>22/07</span><span>23/07</span><span>24/07</span><span>25/07</span><span>26/07</span><span>27/07</span>'
new_xaxis = "".join([f"<span>{d}</span>" for d in dates])

content = content.replace("<span>20/07</span><span>21/07</span><span>22/07</span><span>23/07</span><span>24/07</span><span>25/07</span><span>26/07</span><span>27/07</span>", new_xaxis)

with open("src/components/AdminDashboard.jsx", "w", encoding="utf-8") as f:
    f.write(content)
