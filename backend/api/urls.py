from django.urls import path
from .views import upload_csv, history, download_report, dataset_detail, dataset_delete

urlpatterns = [
    path('upload/', upload_csv, name='upload'),
    path('history/', history, name='history'),
    path('report/<int:pk>/', download_report, name='report'),
    path('dataset/<int:pk>/', dataset_detail, name='dataset-detail'),
    path('dataset/<int:pk>/delete/', dataset_delete, name='dataset-delete'),
]
