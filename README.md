# Chemical Equipment Data Analysis System

This project is a full-stack application designed to simplify the analysis of equipment-related CSV data used in chemical and industrial environments.  
Users can upload CSV files, view automated summaries, analyze data visually, and download a detailed PDF report.

---

##  Project Demo Video
 Watch Here: [https://drive.google.com/your-video-link](https://drive.google.com/file/d/1-WZF355jBrmul52MysnhqSyisv1jE-EN/view?usp=sharing)  

##  Features

1. **CSV Upload**
   - Accepts CSV files containing equipment attributes.
   - Validates required columns before processing.

2. **Data Insights**
   - Total record counting
   - Average flowrate, pressure & temperature
   - Type distribution analytics

3. **PDF Report**
   - Generates a downloadable PDF summary for each uploaded dataset.

4. **History Tracking**
   - Shows recently analyzed datasets along with direct PDF download links.

5. **Interactive Charts**
   - Flowrate comparison (Bar Chart)
   - Equipment type distribution (Pie Chart)

---

##  Required CSV Format

The uploaded CSV must contain the following columns:

- Equipment Name  
- Type  
- Flowrate  
- Pressure  
- Temperature  

---

##  Tech Stack

| Component | Technology |
|----------|------------|
| Frontend | React, Tailwind CSS, Chart.js |
| Backend | Django, Django REST Framework |
| Database | SQLite |
| Reporting | ReportLab (PDF generation) |

---

##  Project Structure

project/
│
├── backend/ → Django REST API
│
└── frontend/ → React User Interface


---

##  How To Run

###  Backend Setup

```bash
cd backend
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver

```
Frontend Setup :-
```
cd frontend
npm install
npm start

```
API Endpoints :-
``` 
Method	Endpoint	Description
GET	/api/upload/	API instructions
POST	/api/upload/	Upload CSV & generate summary
GET	/api/history/	Fetch recent uploads
GET	/api/dataset/<id>/	Fetch dataset details
DELETE	/api/dataset/<id>/	Delete dataset
GET	/api/report/<id>/	Download PDF

```
Future Enhancements :-
```
User Authentication & Role-based Access
Export options (Excel / JSON)
Advanced Data Filtering & Trends
Cloud data storage integration

```
Author :-
```
Chavda Rajveersinh Karansinh
Computer Engineering Student
Focused on Full-Stack Development & Data-Driven Applications
