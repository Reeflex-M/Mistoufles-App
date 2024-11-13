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
    
class StatutSerializer(serializers.ModelSerializer):
    class Meta:
        model = Statut
        fields = ['id_statut', 'libelle_statut']

class ProvenanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Provenance
        fields = ['id_provenance', 'libelle_provenance']

class CategorieSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categorie
        fields = ['id_categorie', 'libelle_categorie']

class SexeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sexe
        fields = ['id_sexe', 'libelle_sexe']

class FASerializer(serializers.ModelSerializer):
    class Meta:
        model = FA
        fields = ['id_fa', 'prenom_fa']

class AnimalSerializer(serializers.ModelSerializer):
    statut = StatutSerializer(read_only=True)
    provenance = ProvenanceSerializer(read_only=True)
    categorie = CategorieSerializer(read_only=True)
    sexe = SexeSerializer(read_only=True)
    fa = FASerializer(read_only=True)

    class Meta:
        model = Animal
        fields = '__all__'
