from django.db import models
from django.contrib.auth.models import User

# class Note(models.Model):

from django.db import models

from django.db import models

class Animal(models.Model):
    id_animal = models.AutoField(primary_key=True)
    nom_animal = models.CharField(max_length=100)
    date_naissance = models.DateField(null=True, blank=True)
    num_identification = models.CharField(max_length=50, unique=True, null=True, blank=True)
    primo_vacc = models.DateField(null=True, blank=True)
    rappel_vacc = models.DateField(null=True, blank=True)
    vermifuge = models.DateField(null=True, blank=True)
    antipuce = models.DateField(null=True, blank=True)
    sterilise = models.DateField(null=True, blank=True)
    biberonnage = models.DateField(null=True, blank=True)
    note = models.TextField(null=True, blank=True)
    statut = models.ForeignKey('Statut', on_delete=models.SET_NULL, null=True, blank=True)
    provenance = models.ForeignKey('Provenance', on_delete=models.SET_NULL, null=True, blank=True)
    categorie = models.ForeignKey('Categorie', on_delete=models.SET_NULL, null=True, blank=True)
    sexe = models.ForeignKey('Sexe', on_delete=models.SET_NULL, null=True, blank=True)
    fa = models.ForeignKey('FA', on_delete=models.SET_NULL, null=True, blank=True)

    def __str__(self):
        return self.nom_animal

class Statut(models.Model):
    id_statut = models.AutoField(primary_key=True)
    libelle_statut = models.CharField(max_length=100)
    
    def __str__(self):
        return self.libelle_statut
    


class FA(models.Model):
    id_fa = models.AutoField(primary_key=True)
    prenom_fa = models.CharField(max_length=100)
    libelle_facebook = models.CharField(max_length=100)
    libelle_veterinaire = models.CharField(max_length=100)
    
    def __str__(self):
        return self.prenom_fa
    
    
class Categorie(models.Model):
    id_categorie = models.AutoField(primary_key=True)
    libelle_categoie = models.CharField(max_length=100)
    
    def __str__(self):
        return self.libelle_categorie
    
    
class Provenance(models.Model):
    id_provenance = models.AutoField(primary_key=True)
    libelle_provenance = models.CharField(max_length=100)
    
    def __str__(self):
        return self.libelle_provenance
    
    
class Sexe(models.Model):
    id_sexe = models.AutoField(primary_key=True)
    libelle_sexe = models.CharField(max_length=100)
    
    def __str__(self):
        return self.libelle_sexe
    
    
class Archive(models.Model):
    id_animal = models.AutoField(primary_key=True)
    nom_animal = models.CharField(max_length=100)
    date_naissance = models.DateField(null=True, blank=True)
    num_identification = models.CharField(max_length=50, unique=True, null=True, blank=True)
    primo_vacc = models.DateField(null=True, blank=True)
    rappel_vacc = models.DateField(null=True, blank=True)
    vermifuge = models.DateField(null=True, blank=True)
    antipuce = models.DateField(null=True, blank=True)
    sterilise = models.DateField(null=True, blank=True)
    biberonnage = models.DateField(null=True, blank=True)
    note = models.TextField(null=True, blank=True)
    statut = models.ForeignKey('Statut', on_delete=models.SET_NULL, null=True, blank=True)
    provenance = models.ForeignKey('Provenance', on_delete=models.SET_NULL, null=True, blank=True)
    categorie = models.ForeignKey('Categorie', on_delete=models.SET_NULL, null=True, blank=True)
    sexe = models.ForeignKey('Sexe', on_delete=models.SET_NULL, null=True, blank=True)
    fa = models.ForeignKey('FA', on_delete=models.SET_NULL, null=True, blank=True)
    
    
    
    
    
    




    
