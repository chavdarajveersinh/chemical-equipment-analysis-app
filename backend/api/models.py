from django.db import models

class Dataset(models.Model):
    file = models.FileField(upload_to='datasets/')
    uploaded_at = models.DateTimeField(auto_now_add=True)
    summary = models.JSONField()

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        qs = Dataset.objects.all().order_by('-uploaded_at')
        if qs.count() > 5:
            qs.last().delete()
