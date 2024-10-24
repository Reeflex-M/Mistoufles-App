from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Animal

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "password"]
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user
    
class AnimalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Animal
        fields = ["id_animal", 
                  "nom_animal", 
                  "date_naissance", 
                  "num_identification", 
                  "primo_vacc", 
                  "rappel_vacc", 
                  "vermifuge", 
                  "antipuce", 
                  "sterilise", 
                  "biberonnage", 
                  "note"]