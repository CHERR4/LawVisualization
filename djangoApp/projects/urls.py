from django.urls import path
from . import views

urlpatterns = [
    path("", views.law_index, name="law_index"),
    path("<int:pk>/", views.law_detail, name="law_detail"),
    path('upload/', views.upload, name='upload'),
]