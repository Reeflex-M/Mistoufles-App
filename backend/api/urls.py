from django.urls import path
from . import views
from .views import StatutList, ProvenanceList, SexeList, CategorieList, FAWithoutAnimalsView

urlpatterns = [
    path("animal/", views.AnimalListCreate.as_view(), name="animal-list"),
    path("animal/delete/<int:pk>/", views.AnimalDelete.as_view(), name="animal-note"),
    path("animal/create/", views.AnimalListCreate.as_view(), name="animal-create"),
    path("animal/<int:pk>/", views.AnimalUpdate.as_view(), name="animal-update"),  
    path("fa/", views.FAListCreate.as_view(), name="fa-list"),
    path("fa/create/", views.FAListCreate.as_view(), name="fa-create"),
    path("fa/test/", views.FAListCreate.as_view(), name="fa-test"),
    path("fa/<int:pk>/", views.FAUpdate.as_view(), name="fa-update"),  
    path('fa/unassigned/', FAWithoutAnimalsView.as_view(), name='fa-unassigned'),
    path('animal/statut/', StatutList.as_view(), name='statut-list'),
    path('animal/provenance/', ProvenanceList.as_view(), name='provenance-list'),
    path('animal/sexe/', SexeList.as_view(), name='sexe-list'),
    path('animal/categorie/', CategorieList.as_view(), name='categorie-list'),
    path('animal/archive/', views.AnimalArchiveList.as_view(), name='animal-archive'),
    path('animal/<int:pk>/images/', views.AnimalImagesView.as_view(), name='animal-images'),
    path('animal/image/<int:pk>/', views.ImageDeleteView.as_view(), name='image-delete'),
    path('fa/<int:pk>/delete/', views.FADelete.as_view(), name='fa-delete'),
]
