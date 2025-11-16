from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Dataset
from .serializers import DatasetSerializer
import pandas as pd
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A4
from django.http import HttpResponse
import io

@api_view(['GET', 'POST'])
def upload_csv(request):
    if request.method == 'GET':
        return Response({"info": "POST CSV using key 'file' with required columns."})

    if 'file' not in request.FILES:
        return Response({"error": "CSV file missing."}, status=status.HTTP_400_BAD_REQUEST)

    uploaded_file = request.FILES['file']

    try:
        df = pd.read_csv(uploaded_file)
    except Exception as e:
        return Response({"error": "Unable to parse CSV", "detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    required_cols = {"Equipment Name", "Type", "Flowrate", "Pressure", "Temperature"}
    if not required_cols.issubset(set(df.columns)):
        return Response({"error": "Required columns missing."}, status=status.HTTP_400_BAD_REQUEST)

    for col in ["Flowrate", "Pressure", "Temperature"]:
        df[col] = pd.to_numeric(df[col], errors="coerce")

    def safe_mean(series):
        s = series.dropna()
        return float(s.mean()) if not s.empty else None

    summary = {
        "total": int(len(df)),
        "avg_flowrate": safe_mean(df["Flowrate"]),
        "avg_pressure": safe_mean(df["Pressure"]),
        "avg_temperature": safe_mean(df["Temperature"]),
        "type_distribution": df["Type"].value_counts().to_dict(),
    }

    try:
        uploaded_file.seek(0)
    except Exception:
        pass

    ds = Dataset.objects.create(file=uploaded_file, summary=summary)
    serializer = DatasetSerializer(ds, context={'request': request})
    return Response(serializer.data, status=status.HTTP_201_CREATED)


@api_view(['GET'])
def history(request):
    qs = Dataset.objects.all().order_by('-uploaded_at')[:5]
    serializer = DatasetSerializer(qs, many=True, context={'request': request})
    return Response(serializer.data)


@api_view(['GET'])
def dataset_detail(request, pk):
    try:
        ds = Dataset.objects.get(pk=pk)
    except Dataset.DoesNotExist:
        return Response({'error': 'Not found'}, status=status.HTTP_404_NOT_FOUND)

    serializer = DatasetSerializer(ds, context={'request': request})
    return Response(serializer.data)


@api_view(['DELETE'])
def dataset_delete(request, pk):
    try:
        ds = Dataset.objects.get(pk=pk)
    except Dataset.DoesNotExist:
        return Response({'error': 'Not found'}, status=status.HTTP_404_NOT_FOUND)

    try:
        if ds.file:
            ds.file.delete(save=False)
    except Exception:
        pass

    ds.delete()
    return Response({'status': 'deleted'}, status=status.HTTP_204_NO_CONTENT)


@api_view(['GET'])
def download_report(request, pk):
    try:
        ds = Dataset.objects.get(pk=pk)
    except Dataset.DoesNotExist:
        return Response({"error": "Not found"}, status=status.HTTP_404_NOT_FOUND)

    buffer = io.BytesIO()
    p = canvas.Canvas(buffer, pagesize=A4)

    p.setFont("Helvetica-Bold", 16)
    p.drawString(50, 800, "Chemical Equipment Report")

    p.setFont("Helvetica", 10)
    p.drawString(50, 785, f"Report ID: {ds.id}")
    if ds.uploaded_at:
        p.drawString(50, 772, f"Uploaded at: {ds.uploaded_at.isoformat()}")

    p.setFont("Helvetica", 12)
    y = 740
    summary = ds.summary or {}
    for k, v in summary.items():
        p.drawString(50, y, f"{k}: {v}"[:100])
        y -= 18
        if y < 60:
            p.showPage()
            p.setFont("Helvetica", 12)
            y = 800

    p.showPage()
    p.save()
    buffer.seek(0)

    filename = f"report_{ds.id}.pdf"
    response = HttpResponse(buffer, content_type='application/pdf')
    response['Content-Disposition'] = f'inline; filename="{filename}"'
    return response
