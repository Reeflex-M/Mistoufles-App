from django.urls import path
from . import views

urlpatterns = [
    path("animal/", views.AnimalListCreate.as_view(), name="animal-list"),
    path("animal/delete/<int:pk>/", views.AnimalDelete.as_view(), name="animal-note"),
    path("animal/create/", views.AnimalListCreate.as_view(), name="animal-create"),
    path("fa/", views.FAListCreate.as_view(), name="fa-list"),
    path("fa/create/", views.FAListCreate.as_view(), name="fa-create"),
    
]
