from rest_framework import serializers
from .models import Dataset

class DatasetSerializer(serializers.ModelSerializer):
    file_url = serializers.SerializerMethodField()
    report_url = serializers.SerializerMethodField()
    uploaded_at_iso = serializers.SerializerMethodField()

    class Meta:
        model = Dataset
        fields = ['id', 'file_url', 'uploaded_at_iso', 'summary', 'report_url']

    def get_file_url(self, obj):
        request = self.context.get('request')
        if obj.file and request:
            return request.build_absolute_uri(obj.file.url)
        return obj.file.url if obj.file else None

    def get_report_url(self, obj):
        request = self.context.get('request')
        if request:
            return request.build_absolute_uri(f'/api/report/{obj.id}/')
        return f'/api/report/{obj.id}/'

    def get_uploaded_at_iso(self, obj):
        return obj.uploaded_at.isoformat() if obj.uploaded_at else None
