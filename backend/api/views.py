from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics
from .serializers import UserSerializer, AnimalSerializer, FASerializer, UserSerializer, StatutSerializer, ProvenanceSerializer, SexeSerializer, CategorieSerializer
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.views import APIView
from .models import Animal, FA, Statut, Provenance, Sexe, Categorie

#ANIMAL
class AnimalListCreate(generics.ListCreateAPIView):
    serializer_class = AnimalSerializer
    permission_classes = [IsAuthenticated]
    
    #Return All animal
    def get_queryset(self):
        return Animal.objects.all()
    
    def perform_create_animal(self, serializer):
        if serializer.is_valid():
            serializer.save(user=self.request.user)
        else:
            print(serializer.errors)

class AnimalDelete(generics.DestroyAPIView):
    queryset = Animal.objects.all()
    serializer_class = AnimalSerializer
    permission_classes = [IsAuthenticated]





#FA
class FAListCreate(generics.ListCreateAPIView):
    serializer_class = FASerializer
    permission_classes = [IsAuthenticated]
    
    #Return All fa
    def get_queryset(self):
        return FA.objects.all()
    
    def perform_create_fa(self, serializer):
        if serializer.is_valid():
            serializer.save(user=self.request.user)
        else:
            print(serializer.errors)








# Statut
class StatutList(generics.ListAPIView):
    queryset = Statut.objects.all()
    serializer_class = StatutSerializer
    permission_classes = [IsAuthenticated]

# Provenance
class ProvenanceList(generics.ListAPIView):
    queryset = Provenance.objects.all()
    serializer_class = ProvenanceSerializer
    permission_classes = [IsAuthenticated]

# Sexe
class SexeList(generics.ListAPIView):
    queryset = Sexe.objects.all()
    serializer_class = SexeSerializer
    permission_classes = [IsAuthenticated]

# Catégorie
class CategorieList(generics.ListAPIView):
    queryset = Categorie.objects.all()
    serializer_class = CategorieSerializer
    permission_classes = [IsAuthenticated]






#USER
class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]


class CurrentUserView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)