from django.db import models
from django.contrib.auth.models import User

# class Note(models.Model):

from django.db import models

class Animal(models.Model):
    id_animal = models.AutoField(primary_key=True)
    nom_animal = models.CharField(max_length=100)
    date_naissance = models.DateField()
    num_identification = models.CharField(max_length=50)
    primo_vacc = models.DateField()
    rappel_vacc = models.DateField()
    vermifuge = models.DateField()
    antipuce = models.DateField()
    sterilise = models.DateField()
    biberonnage = models.DateField()
    note = models.TextField()

    def __str__(self):
        return self.nom_animal

    
