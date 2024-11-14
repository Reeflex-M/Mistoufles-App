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
        fields = ["id_fa", 
                  "prenom_fa",
                  "commune_fa",
                  "telephone_fa",
                  "libelle_reseausociaux",
                  "libelle_veterinaire",
                  "note"]
        

class AnimalSerializer(serializers.ModelSerializer):
    statut_libelle = serializers.SerializerMethodField()
    provenance_libelle = serializers.SerializerMethodField()
    categorie_libelle = serializers.SerializerMethodField()
    sexe_libelle = serializers.SerializerMethodField()
    fa_libelle = serializers.SerializerMethodField()

    class Meta:
        model = Animal
        fields = '__all__'

    def get_statut_libelle(self, obj):
        return obj.statut.libelle_statut if obj.statut else None

    def get_provenance_libelle(self, obj):
        return obj.provenance.libelle_provenance if obj.provenance else None

    def get_categorie_libelle(self, obj):
        return obj.categorie.libelle_categorie if obj.categorie else None

    def get_sexe_libelle(self, obj):
        return obj.sexe.libelle_sexe if obj.sexe else None

    def get_fa_libelle(self, obj):
        return obj.fa.prenom_fa if obj.fa else None
