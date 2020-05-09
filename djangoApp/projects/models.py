from django.db import models


class Law(models.Model):
    id = models.IntegerField(primary_key=True)
    text = models.TextField()
