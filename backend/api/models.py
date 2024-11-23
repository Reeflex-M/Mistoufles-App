import os
from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
from django.db.models.signals import pre_delete
from django.dispatch import receiver

class Animal(models.Model):
    id_animal = models.AutoField(primary_key=True)
    nom_animal = models.CharField(max_length=100)
    date_arrivee = models.DateTimeField(default=timezone.now)  # Modifié
    date_naissance = models.DateField(null=True, blank=True)
    num_identification = models.CharField(max_length=50, unique=True, null=True, blank=True)
    primo_vacc = models.DateField(null=True, blank=True)
    rappel_vacc = models.DateField(null=True, blank=True)
    vermifuge = models.DateField(null=True, blank=True)
    antipuce = models.DateField(null=True, blank=True)
    sterilise = models.BooleanField(default=False, null=True, blank=True)
    biberonnage = models.BooleanField(default=False, null=True, blank=True)
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
    prenom_fa = models.CharField(max_length=100, null=True, blank=True)
    commune_fa = models.CharField(max_length=100, null=True, blank=True)
    telephone_fa = models.CharField(max_length=20, null=True, blank=True)
    libelle_reseausociaux = models.CharField(max_length=100, null=True, blank=True)
    libelle_veterinaire = models.CharField(max_length=100, null=True, blank=True)
    note = models.TextField(null=True, blank=True)
    
    def __str__(self):
        return self.prenom_fa
    

class Categorie(models.Model):
    id_categorie = models.AutoField(primary_key=True)
    libelle_categorie = models.CharField(max_length=100)
    
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
    created_at = models.DateTimeField(default=timezone.now)
    nom_animal = models.CharField(max_length=100)
    date_naissance = models.DateField(null=True, blank=True)
    num_identification = models.CharField(max_length=50, unique=True, null=True, blank=True)
    primo_vacc = models.DateField(null=True, blank=True)
    rappel_vacc = models.DateField(null=True, blank=True)
    vermifuge = models.DateField(null=True, blank=True)
    antipuce = models.DateField(null=True, blank=True)
    sterilise = models.BooleanField(default=False, null=True, blank=True)
    note = models.TextField(null=True, blank=True)
    statut = models.ForeignKey('Statut', on_delete=models.SET_NULL, null=True, blank=True)
    provenance = models.ForeignKey('Provenance', on_delete=models.SET_NULL, null=True, blank=True)
    categorie = models.ForeignKey('Categorie', on_delete=models.SET_NULL, null=True, blank=True)
    sexe = models.ForeignKey('Sexe', on_delete=models.SET_NULL, null=True, blank=True)
    fa = models.ForeignKey('FA', on_delete=models.SET_NULL, null=True, blank=True)

class Image(models.Model):
    id_image = models.AutoField(primary_key=True)
    animal_reference = models.ForeignKey(Animal, on_delete=models.CASCADE, related_name='image_set')  # Renamed from 'animal' to 'animal_reference'
    image = models.ImageField(upload_to='animaux/')
    date_upload = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.animal_reference.nom_animal} - {self.id_image}"

    def delete(self, *args, **kwargs):
        # Supprime le fichier physique avant de supprimer l'objet
        if self.image:
            if os.path.isfile(self.image.path):
                os.remove(self.image.path)
        super().delete(*args, **kwargs)

@receiver(pre_delete, sender=Animal)
def delete_animal_images(sender, instance, **kwargs):
    # Récupère toutes les images avant de les supprimer
    images = Image.objects.filter(animal_reference=instance)
    for image in images:
        # La méthode delete() surchargée sera appelée pour chaque image
        image.delete()