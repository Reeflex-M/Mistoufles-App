from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Animal, Statut, FA, Provenance, Sexe, Categorie

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
                  "note",
                  "statut",
                  "provenance",
                  "categorie",
                  "sexe",
                  "fa"]
        

class StatutSerializer(serializers.ModelSerializer):
    class Meta:
        model = Statut
        fields = ["id_statut", 
                  "libelle_statut"]
        
class FASerializer(serializers.ModelSerializer):
    class Meta:
        model = FA
        fields = ["id_fa", 
                  "prenom_fa",
                  "commune_fa",
                  "telephone_fa",
                  "libelle_reseausociaux",
                  "libelle_veterinaire",
                  "note"]
        
        
class CategorieSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categorie
        fields = ["id_categorie", 
                  "libelle_categorie"]

class ProvenanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Provenance
        fields = ["id_provenance", 
                  "libelle_provenance"]
        
class SexeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sexe
        fields = ["id_sexe", 
                  "libelle_sexe"]
                 