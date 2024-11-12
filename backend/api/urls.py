from django.urls import path
from . import views
from .views import StatutList, ProvenanceList, SexeList, CategorieList

urlpatterns = [
    path("animal/", views.AnimalListCreate.as_view(), name="animal-list"),
    path("animal/delete/<int:pk>/", views.AnimalDelete.as_view(), name="animal-note"),
    path("animal/create/", views.AnimalListCreate.as_view(), name="animal-create"),
    path("fa/", views.FAListCreate.as_view(), name="fa-list"),
    path("fa/create/", views.FAListCreate.as_view(), name="fa-create"),
    path("fa/test/", views.FAListCreate.as_view(), name="fa-test"),
    path("fa/<int:pk>/", views.FAUpdate.as_view(), name="fa-update"),
    path('animal/statut/', StatutList.as_view(), name='statut-list'),
    path('animal/provenance/', ProvenanceList.as_view(), name='provenance-list'),
    path('animal/sexe/', SexeList.as_view(), name='sexe-list'),
    path('animal/categorie/', CategorieList.as_view(), name='categorie-list'),
]
