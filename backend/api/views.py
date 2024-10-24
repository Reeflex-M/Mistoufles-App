from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics
from .serializers import UserSerializer, AnimalSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Animal

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



class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]
